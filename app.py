from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():

    name = request.form['name'].strip()
    email = request.form['email'].strip()
    subject = request.form['subject'].strip()
    message = request.form['message'].strip()

    if not name:
        return render_template(
            'index.html',
            success="Name cannot be empty!",
            status="error"
        )

    if not email:
        return render_template(
            'index.html',
            success="Email cannot be empty!",
            status="error"
        )

    if not subject:
        return render_template(
            'index.html',
            success="Subject cannot be empty!",
            status="error"
        )

    if not message:
        return render_template(
            'index.html',
            success="Message cannot be empty!",
            status="error"
        )

    return render_template(
        'index.html',
        success="Message Sent Successfully!",
        status="success"
    )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)