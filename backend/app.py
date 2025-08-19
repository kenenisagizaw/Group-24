from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import urlparse
import ipaddress
import validators


app = Flask(__name__)

# Allow Vite dev server origins during development
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
            ]
        }
    },
)


# -----------------------------
# Rule implementations
# -----------------------------

SPECIAL_CHARS = set("@-__?=&%")
SUSPICIOUS_KEYWORDS = {"login", "verify", "secure", "update", "account", "confirm"}
SENSITIVE_HOST_HINTS = {"bank", "login", "paypal"}


def _get_parsed(url: str):
    try:
        return urlparse(url)
    except Exception:
        return None


def contains_ip_address(url: str) -> bool:
    parsed = _get_parsed(url)
    if not parsed or not parsed.hostname:
        return False
    hostname = parsed.hostname
    try:
        ipaddress.ip_address(hostname)
        return True
    except Exception:
        return False


def url_length(url: str) -> bool:
    parsed = _get_parsed(url)
    if not parsed or not parsed.hostname:
        return False
    domain = parsed.hostname
    return len(url) > 100 or len(domain) > 50


def suspicious_subdomains(url: str) -> bool:
    parsed = _get_parsed(url)
    if not parsed or not parsed.hostname:
        return False
    hostname = parsed.hostname
    labels = hostname.split(".")
    if len(labels) < 2:
        return False

    # Registered domain naive extraction (last two labels)
    registered_domain = ".".join(labels[-2:])
    subdomains = labels[:-2]

    too_many_subdomains = len(subdomains) > 3

    # Impersonation attempt: suspicious words in subdomain while not in the registered domain
    subdomain_str = ".".join(subdomains).lower()
    registered_lower = registered_domain.lower()
    impersonation = any(hint in subdomain_str for hint in ["paypal", "bank", "secure", "login"]) and not any(
        hint in registered_lower for hint in ["paypal", "bank"]
    )

    return too_many_subdomains or impersonation


def use_of_https(url: str) -> bool:
    parsed = _get_parsed(url)
    if not parsed:
        return False
    hostname = (parsed.hostname or "").lower()
    path = (parsed.path or "").lower()
    looks_sensitive = any(hint in hostname or hint in path for hint in SENSITIVE_HOST_HINTS)
    return looks_sensitive and parsed.scheme != "https"


def special_characters(url: str) -> bool:
    parsed = _get_parsed(url)
    if not parsed:
        return False
    target = (parsed.path or "") + ("?" + parsed.query if parsed.query else "")
    if not target:
        return False
    specials = sum(1 for ch in target if ch in SPECIAL_CHARS)
    ratio = specials / max(len(target), 1)
    return ratio > 0.3


def suspicious_keywords(url: str) -> bool:
    parsed = _get_parsed(url)
    if not parsed:
        return False
    path_and_query = (parsed.path or "") + ("?" + parsed.query if parsed.query else "")
    text = path_and_query.lower()
    return any(kw in text for kw in SUSPICIOUS_KEYWORDS)


RULES = [
    {
        "rule_name": "contains_ip_address",
        "description": "URL contains an IP address instead of a domain name.",
        "func": contains_ip_address,
        "weight": 0.25,
    },
    {
        "rule_name": "url_length",
        "description": "URL or domain length is unusually long.",
        "func": url_length,
        "weight": 0.15,
    },
    {
        "rule_name": "suspicious_subdomains",
        "description": "URL has excessive or impersonating subdomains.",
        "func": suspicious_subdomains,
        "weight": 0.2,
    },
    {
        "rule_name": "use_of_https",
        "description": "Sensitive-looking site does not use HTTPS.",
        "func": use_of_https,
        "weight": 0.2,
    },
    {
        "rule_name": "special_characters",
        "description": "High ratio of special characters in path or query.",
        "func": special_characters,
        "weight": 0.1,
    },
    {
        "rule_name": "suspicious_keywords",
        "description": "URL contains common phishing keywords (e.g., 'login', 'verify').",
        "func": suspicious_keywords,
        "weight": 0.1,
    },
]


def analyze_url(url: str):
    total_weight = sum(rule["weight"] for rule in RULES)
    matched_score = 0.0
    rules_triggered = []

    for rule in RULES:
        matched = bool(rule["func"](url))
        if matched:
            matched_score += rule["weight"]
        rules_triggered.append(
            {
                "rule_name": rule["rule_name"],
                "description": rule["description"],
                "matched": matched,
            }
        )

    score = matched_score / total_weight if total_weight > 0 else 0.0
    is_phishing = score >= 0.75
    return is_phishing, score, rules_triggered


@app.route("/api/analyze", methods=["POST"])
def analyze():
    if not request.is_json:
        return jsonify({"error": "Request body must be JSON"}), 400

    payload = request.get_json(silent=True) or {}
    url = payload.get("url")
    if not url:
        return jsonify({"error": "Missing 'url' field"}), 400

    if not validators.url(url):
        return jsonify({"error": "Invalid URL format"}), 400

    is_phishing, score, rules_triggered = analyze_url(url)
    response = {
        "url": url,
        "is_phishing": is_phishing,
        "score": round(float(score), 4),
        "rules_triggered": rules_triggered,
    }
    return jsonify(response)


if __name__ == "__main__":
    # Development server
    app.run(host="0.0.0.0", port=5000, debug=True)


