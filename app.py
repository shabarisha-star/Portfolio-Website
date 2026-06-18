from flask import Flask, render_template, request
import mysql.connector

app = Flask(__name__)

connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Shabareesh123",
    database="portfolio_db"
)

cursor = connection.cursor()

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/contact', methods=['POST'])
def contact():

    try:
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

        sql = """
        INSERT INTO contact_messages
        (name, email, subject, message)
        VALUES (%s, %s, %s, %s)
        """

        values = (
            name,
            email,
            subject,
            message
        )

        cursor.execute(sql, values)
        connection.commit()

        return render_template(
            'index.html',
            success="Message Sent Successfully!",
            status="success"
        )

    except Exception as e:

        return render_template(
            'index.html',
            success=f"Error: {str(e)}",
            status="error"
        )


@app.route('/messages')
def messages():

    cursor.execute("""
        SELECT
            id,
            name,
            email,
            subject,
            message,
            created_at
        FROM contact_messages
        ORDER BY id DESC
    """)

    messages = cursor.fetchall()

    return render_template(
        'messages.html',
        messages=messages
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)