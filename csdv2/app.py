import os, secrets
from functools import wraps
from flask import (Flask, render_template, request, jsonify,
                   redirect, url_for, session)

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", secrets.token_hex(32))

# ── AUTH HELPERS ─────────────────────────────────────────────────────────────

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "uid" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated

# ── SESSION ROUTES ────────────────────────────────────────────────────────────

@app.route("/session/set", methods=["POST"])
def set_session():
    """Called from frontend after Firebase login succeeds."""
    data = request.get_json()
    session["uid"]        = data.get("uid")
    session["username"]   = data.get("username")
    session["full_name"]  = data.get("full_name")
    session["avatar_color"] = data.get("avatar_color", "#6c63ff")
    return jsonify({"ok": True})

@app.route("/session/clear", methods=["POST"])
def clear_session():
    session.clear()
    return jsonify({"ok": True})

# ── PAGE ROUTES ───────────────────────────────────────────────────────────────

@app.route("/login")
def login():
    if "uid" in session:
        return redirect(url_for("index"))
    return render_template("login.html")

@app.route("/register")
def register():
    if "uid" in session:
        return redirect(url_for("index"))
    return render_template("register.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

@app.route("/")
@login_required
def index():
    return render_template("index.html",
        uid=session["uid"],
        full_name=session["full_name"],
        username=session["username"],
        avatar_color=session["avatar_color"])

@app.route("/chat")
@app.route("/chat/<room>")
@login_required
def chat(room="general"):
    return render_template("chat.html",
        uid=session["uid"],
        full_name=session["full_name"],
        username=session["username"],
        avatar_color=session["avatar_color"],
        room=room)

@app.route("/gallery")
@login_required
def gallery():
    return render_template("gallery.html",
        uid=session["uid"],
        full_name=session["full_name"],
        avatar_color=session["avatar_color"])

@app.route("/stories")
@login_required
def stories():
    return render_template("stories.html",
        uid=session["uid"],
        full_name=session["full_name"],
        avatar_color=session["avatar_color"])

@app.route("/timeline")
@login_required
def timeline():
    return render_template("timeline.html",
        uid=session["uid"],
        full_name=session["full_name"],
        avatar_color=session["avatar_color"])

@app.route("/members")
@login_required
def members():
    return render_template("members.html",
        uid=session["uid"],
        full_name=session["full_name"],
        avatar_color=session["avatar_color"])

@app.route("/profile/<username>")
@login_required
def profile(username):
    return render_template("profile.html",
        uid=session["uid"],
        full_name=session["full_name"],
        avatar_color=session["avatar_color"],
        profile_username=username)

@app.route("/capsule")
@login_required
def capsule():
    return render_template("capsule.html",
        uid=session["uid"],
        full_name=session["full_name"],
        avatar_color=session["avatar_color"])

@app.route("/polls")
@login_required
def polls():
    return render_template("polls.html",
        uid=session["uid"],
        full_name=session["full_name"],
        avatar_color=session["avatar_color"])

@app.route("/events")
@login_required
def events():
    return render_template("events.html",
        uid=session["uid"],
        full_name=session["full_name"],
        avatar_color=session["avatar_color"])

@app.route("/notifications")
@login_required
def notifications():
    return render_template("notifications.html",
        uid=session["uid"],
        full_name=session["full_name"],
        avatar_color=session["avatar_color"])

@app.route("/dm/<username>")
@login_required
def dm(username):
    return render_template("dm.html",
        uid=session["uid"],
        full_name=session["full_name"],
        avatar_color=session["avatar_color"],
        other_username=username)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
