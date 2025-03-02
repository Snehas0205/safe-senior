from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///safe1.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    contact = db.Column(db.String(20), nullable=False)

class HealthResponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    q1 = db.Column(db.String(10), nullable=False)
    q2 = db.Column(db.String(10), nullable=False)
    q3 = db.Column(db.String(10), nullable=False)
    q4 = db.Column(db.String(10), nullable=False)
    q5 = db.Column(db.String(10), nullable=False)
    q6 = db.Column(db.String(10), nullable=False)
    q7 = db.Column(db.String(10), nullable=False)
    q8 = db.Column(db.String(10), nullable=False)
    q9 = db.Column(db.String(10), nullable=False)
    q10 = db.Column(db.String(10), nullable=False)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        name = request.form['name']
        username = request.form['username']
        email = request.form['email']

        user = User.query.filter_by(username=username).first()
        if not user:
            flash('Username does not exist', 'danger')
            return redirect(url_for('login'))

        if user.email != email:
            flash('Invalid email', 'danger')
            return redirect(url_for('login'))

        if user.name != name:
            flash('Invalid name', 'danger')
            return redirect(url_for('login'))

        session['user_id'] = user.id
        session.permanent = True
        flash('Logged in successfully', 'success')
        return redirect(url_for('index'))

    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form['name']
        age = request.form['age']
        username = request.form['username']
        email = request.form['email']
        contact = request.form['contact']

        if not name or not age or not username or not email or not contact:
            flash('Please fill out all fields.', 'danger')
            return redirect(url_for('signup'))

        if User.query.filter_by(username=username).first():
            flash('Username already exists', 'danger')
            return redirect(url_for('signup'))

        if User.query.filter_by(email=email).first():
            flash('Email already exists', 'danger')
            return redirect(url_for('signup'))

        if User.query.filter_by(contact=contact).first():
            flash('Contact number already exists', 'danger')
            return redirect(url_for('signup'))

        new_user = User(name=name, age=age, username=username, email=email, contact=contact)
        db.session.add(new_user)
        db.session.commit()

        session['user_id'] = new_user.id
        flash('Account created successfully', 'success')
        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/')
def index1():
    return render_template('index1.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully', 'success')
    return redirect(url_for('index1'))

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/cyber')
def cyber():
    return render_template('cyber.html')

@app.route('/medication-reminders')
def medication_reminders():
    return render_template('medication_reminders.html')

@app.route('/diet_nutrition')
def diet_nutrition():
    return render_template('diet_nutrition.html')

@app.route('/Healthq', methods=['GET', 'POST'])
def Healthq():

    user_id = session.get('user_id')
    if not user_id:
        flash("Please log in first.", "warning")
        return redirect(url_for('login')) 

    if request.method == 'POST':
        responses = {f'q{i}': request.form.get(f'q{i}', '') for i in range(1, 11)}
        response = HealthResponse(user_id=user_id, **responses)
        db.session.add(response)
        db.session.commit()

        flash("Questionnaire submitted successfully!", "success")  
        return redirect(url_for('index'))

    return render_template('Healthq.html')

@app.route('/emergency_contact')
def emergency_contact():
    return render_template('emergency_contact.html')

@app.route('/report')
def report():
    return render_template('report.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
