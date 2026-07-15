import os
import jwt
import datetime
from functools import wraps
from flask import Flask, request, jsonify, render_template, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import bcrypt

app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = 'edumed_session_secret_key_2026'
CORS(app)

# Database path resolution
db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend', 'prisma', 'dev.db'))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
JWT_SECRET = 'edumed_super_secret_key_2026'

# --- MODELS ---
class User(db.Model):
    __tablename__ = 'User'
    id = db.Column(db.String(36), primary_key=True, default=lambda: os.urandom(16).hex()) # simple uuid fallback
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), default='student')
    university = db.Column(db.String(100), nullable=True)
    year = db.Column(db.String(10), nullable=True)
    createdAt = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    points = db.Column(db.Integer, default=0)
    casesDone = db.Column(db.Integer, default=0)
    ethicsScore = db.Column(db.Integer, default=0)
    ethicsDone = db.Column(db.Integer, default=0)

    results = db.relationship('SimulationResult', backref='user', cascade="all, delete-orphan")
    volunteer_apps = db.relationship('VolunteerApplication', backref='user', cascade="all, delete-orphan")

class Case(db.Model):
    __tablename__ = 'Case'
    id = db.Column(db.String(36), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    isActive = db.Column(db.Boolean, default=True)

    steps = db.relationship('SimulationStep', backref='case', cascade="all, delete-orphan")
    results = db.relationship('SimulationResult', backref='case', cascade="all, delete-orphan")

class SimulationStep(db.Model):
    __tablename__ = 'SimulationStep'
    id = db.Column(db.String(36), primary_key=True)
    caseId = db.Column(db.String(36), db.ForeignKey('Case.id', ondelete='CASCADE'), nullable=False)
    systemMessage = db.Column(db.Text, nullable=False)
    stepOrder = db.Column(db.Integer, default=0)

    options = db.relationship('SimulationOption', backref='step', cascade="all, delete-orphan")

class SimulationOption(db.Model):
    __tablename__ = 'SimulationOption'
    id = db.Column(db.String(36), primary_key=True)
    stepId = db.Column(db.String(36), db.ForeignKey('SimulationStep.id', ondelete='CASCADE'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    patientResponse = db.Column(db.Text, nullable=False)
    emotionClass = db.Column(db.String(50), default='calm')
    emotionText = db.Column(db.String(100), default='😌 Tinchlangan')
    vitalsHr = db.Column(db.Integer, default=80)
    scoreDelta = db.Column(db.Integer, default=0)
    nextStepId = db.Column(db.String(36), nullable=True)

class EthicsQuestion(db.Model):
    __tablename__ = 'EthicsQuestion'
    id = db.Column(db.String(36), primary_key=True)
    question = db.Column(db.Text, nullable=False)
    lawText = db.Column(db.Text, nullable=False)
    options = db.Column(db.Text, nullable=False)  # JSON stringified
    correctAnswer = db.Column(db.Integer, nullable=False)
    explanations = db.Column(db.Text, nullable=False)  # JSON stringified
    explanationCorrect = db.Column(db.Text, nullable=False)

class SimulationResult(db.Model):
    __tablename__ = 'SimulationResult'
    id = db.Column(db.String(36), primary_key=True)
    score = db.Column(db.Integer, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    userId = db.Column(db.String(36), db.ForeignKey('User.id'), nullable=False)
    caseId = db.Column(db.String(36), db.ForeignKey('Case.id'), nullable=False)

class VolunteerProject(db.Model):
    __tablename__ = 'VolunteerProject'
    id = db.Column(db.String(36), primary_key=True)
    avatar = db.Column(db.String(50), default='🏥')
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    slotsMax = db.Column(db.Integer, default=20)
    pointsReward = db.Column(db.Integer, default=500)
    createdAt = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    applications = db.relationship('VolunteerApplication', backref='project', cascade="all, delete-orphan")

class VolunteerApplication(db.Model):
    __tablename__ = 'VolunteerApplication'
    id = db.Column(db.String(36), primary_key=True)
    projectId = db.Column(db.String(36), db.ForeignKey('VolunteerProject.id', ondelete='CASCADE'), nullable=False)
    userId = db.Column(db.String(36), db.ForeignKey('User.id', ondelete='CASCADE'), nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.datetime.utcnow)


# --- MIDDLEWARE / HELPERS ---
def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            # Check JWT header fallback for AJAX/REST Compatibility
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                try:
                    token = auth_header.split(' ')[1]
                    decoded = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
                    request.user_id = decoded['userId']
                    request.user_role = decoded['role']
                    return f(*args, **kwargs)
                except Exception:
                    return jsonify({'error': 'Yaroqsiz token'}), 401
            return redirect(url_for('login_view'))
        
        request.user_id = session['user_id']
        request.user_role = session['user_role']
        return f(*args, **kwargs)
    return decorated

def get_current_user():
    if 'user_id' in session:
        return User.query.get(session['user_id'])
    return None

def hash_pw(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(10)).decode('utf-8')

def check_pw(password, hashed):
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False

# Seeded random helper for daily cases
def get_seeded_random(seed_str):
    import math
    h = 0
    for char in seed_str:
        h = ord(char) + ((h << 5) - h)
    def rand():
        nonlocal h
        x = math.sin(h) * 10000
        h += 1
        return x - math.floor(x)
    return rand

def get_daily_cases(all_cases):
    if len(all_cases) <= 10:
        return all_cases
    import random
    today_str = datetime.date.today().strftime('%m/%d/%Y')
    rand = get_seeded_random(today_str)
    
    shuffled = list(all_cases)
    # Custom shuffle using seeded random
    for i in range(len(shuffled) - 1, 0, -1):
        j = int(rand() * (i + 1))
        shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
    return shuffled[:10]


# --- VIEW CONTROLLERS (HTML Rendering) ---
@app.route('/')
def landing_view():
    user = get_current_user()
    if user:
        return redirect(url_for('dashboard_view'))
    return render_template('landing.html')

@app.route('/login')
def login_view():
    user = get_current_user()
    if user:
        return redirect(url_for('dashboard_view'))
    return render_template('login.html')

@app.route('/register')
def register_view():
    user = get_current_user()
    if user:
        return redirect(url_for('dashboard_view'))
    return render_template('register.html')

@app.route('/logout')
def logout_action():
    session.clear()
    return redirect(url_for('landing_view'))

@app.route('/dashboard')
@auth_required
def dashboard_view():
    user = User.query.get(request.user_id)
    stats = fetch_user_stats_internal(user)
    notifications = fetch_notifications_internal(user)
    daily_cases = get_daily_cases(Case.query.filter_by(isActive=True).all())
    
    # Recommended case (first uncompleted daily case)
    recommended_case = None
    completed_ids = [r.caseId for r in user.results]
    for c in daily_cases:
        if c.id not in completed_ids:
            recommended_case = c
            break
    if not recommended_case and daily_cases:
        recommended_case = daily_cases[0]

    return render_template('dashboard.html', user=user, stats=stats, notifications=notifications, recommended_case=recommended_case)

@app.route('/simulator')
@auth_required
def simulator_list_view():
    user = User.query.get(request.user_id)
    all_cases = Case.query.filter_by(isActive=True).all()
    daily_cases = get_daily_cases(all_cases)
    completed_ids = [r.caseId for r in user.results]
    return render_template('simulator_list.html', user=user, cases=daily_cases, completed_ids=completed_ids)

@app.route('/simulator/<case_id>')
@auth_required
def simulator_view(case_id):
    user = User.query.get(request.user_id)
    case_data = Case.query.get_or_404(case_id)
    step = SimulationStep.query.filter_by(caseId=case_id, stepOrder=0).first()
    return render_template('simulator.html', user=user, case=case_data, step=step)

@app.route('/laboratory')
@auth_required
def laboratory_view():
    user = User.query.get(request.user_id)
    return render_template('laboratory.html', user=user)

@app.route('/ethics-test')
@auth_required
def ethics_test_view():
    user = User.query.get(request.user_id)
    return render_template('ethics_test.html', user=user)

@app.route('/results')
@auth_required
def results_view():
    user = User.query.get(request.user_id)
    latest_result = SimulationResult.query.filter_by(userId=user.id).order_size = 1 # order by date desc
    latest_result = SimulationResult.query.filter_by(userId=user.id).order_by(SimulationResult.createdAt.desc()).first()
    return render_template('results.html', user=user, result=latest_result)

@app.route('/profile')
@auth_required
def profile_view():
    user = User.query.get(request.user_id)
    results = SimulationResult.query.filter_by(userId=user.id).order_by(SimulationResult.createdAt.desc()).all()
    # Mock data to fill charts on profile
    heatmap_cells = [1, 2, 0, 3, 1, 0, 4, 2, 1, 0, 2, 3] # simple values
    return render_template('profile.html', user=user, results=results, heatmap_cells=heatmap_cells)

@app.route('/volunteer')
@auth_required
def volunteer_view():
    user = User.query.get(request.user_id)
    projects = fetch_volunteer_projects_internal(user.id)
    timeline = fetch_volunteer_applications_internal(user.id)
    return render_template('volunteer.html', user=user, projects=projects, timeline=timeline)

@app.route('/admin-dashboard')
@auth_required
def admin_dashboard_view():
    if request.user_role != 'admin':
        return redirect(url_for('dashboard_view'))
    user = User.query.get(request.user_id)
    users = User.query.all()
    projects = fetch_volunteer_projects_internal(user.id)
    return render_template('admin_dashboard.html', user=user, users=users, projects=projects)

@app.route('/teacher-dashboard')
@auth_required
def teacher_dashboard_view():
    if request.user_role not in ['teacher', 'admin']:
        return redirect(url_for('dashboard_view'))
    user = User.query.get(request.user_id)
    students = User.query.filter_by(role='student').all()
    return render_template('teacher_dashboard.html', user=user, students=students)

@app.route('/student-details/<student_id>')
@auth_required
def student_details_view(student_id):
    if request.user_role not in ['teacher', 'admin']:
        return redirect(url_for('dashboard_view'))
    user = User.query.get(request.user_id)
    student = User.query.get_or_404(student_id)
    stats = fetch_user_stats_internal(student)
    results = SimulationResult.query.filter_by(userId=student.id).all()
    return render_template('student_details.html', user=user, student=student, stats=stats, results=results)

@app.route('/scenario-builder')
@auth_required
def scenario_builder_view():
    user = User.query.get(request.user_id)
    return render_template('scenario_builder.html', user=user)

@app.route('/content-management')
@auth_required
def content_management_view():
    user = User.query.get(request.user_id)
    return render_template('content_management.html', user=user)

@app.route('/monitoring')
@auth_required
def monitoring_view():
    user = User.query.get(request.user_id)
    return render_template('monitoring.html', user=user)

@app.route('/settings')
@auth_required
def settings_view():
    user = User.query.get(request.user_id)
    return render_template('settings.html', user=user)

@app.route('/notifications')
@auth_required
def notifications_view():
    user = User.query.get(request.user_id)
    notifications = fetch_notifications_internal(user)
    return render_template('notifications.html', user=user, notifications=notifications)


# --- REST API CONTROLLERS (JSON Compatibility) ---

@app.route('/api/auth/register', methods=['POST'])
def api_register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'student')
        university = data.get('university', 'TMA')
        
        existing = User.query.filter_by(email=email).first()
        if existing:
            return jsonify({'error': 'Ushbu email bilan foydalanuvchi mavjud'}), 400
            
        hashed_password = hash_pw(password)
        new_user = User(
            id=os.urandom(16).hex(),
            name=name,
            email=email,
            password=hashed_password,
            role=role,
            university=university,
            year='3'
        )
        db.session.add(new_user)
        db.session.commit()
        
        token = jwt.sign({'userId': new_user.id, 'role': new_user.role}, JWT_SECRET, algorithm='HS256')
        # Setup Server Session too
        session['user_id'] = new_user.id
        session['user_role'] = new_user.role
        
        return jsonify({'token': token, 'user': {'id': new_user.id, 'name': new_user.name, 'email': new_user.email, 'role': new_user.role}})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Server xatosi'}), 500

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        user = User.query.filter_by(email=email).first()
        if not user or not check_pw(password, user.password):
            return jsonify({'error': 'Email yoki parol xato'}), 400
            
        token = jwt.sign({'userId': user.id, 'role': user.role}, JWT_SECRET, algorithm='HS256')
        session['user_id'] = user.id
        session['user_role'] = user.role
        
        return jsonify({'token': token, 'user': {'id': user.id, 'name': user.name, 'email': user.email, 'role': user.role}})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Server xatosi'}), 500

@app.route('/api/me', methods=['GET', 'PUT'])
@auth_required
def api_me():
    user = User.query.get(request.user_id)
    if not user:
        return jsonify({'error': 'Foydalanuvchi topilmadi'}), 404
        
    if request.method == 'GET':
        return jsonify({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'points': user.points,
            'casesDone': user.casesDone,
            'university': user.university,
            'year': user.year
        })
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            user.name = data.get('name', user.name)
            user.email = data.get('email', user.email)
            user.university = data.get('university', user.university)
            db.session.commit()
            return jsonify({
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role,
                'points': user.points,
                'casesDone': user.casesDone,
                'university': user.university,
                'year': user.year
            })
        except Exception as e:
            print(e)
            return jsonify({'error': 'Tahrirlab bo\'lmadi'}), 500

@app.route('/api/cases', methods=['GET'])
def api_cases():
    cases = Case.query.filter_by(isActive=True).all()
    # Serializing cases
    res = []
    for c in get_daily_cases(cases):
        res.append({
            'id': c.id,
            'title': c.title,
            'description': c.description,
            'difficulty': c.difficulty,
            'category': c.category,
            'isActive': c.isActive
        })
    return jsonify(res)

@app.route('/api/cases/<case_id>', methods=['GET'])
def api_case_details(case_id):
    c = Case.query.get_or_404(case_id)
    steps_data = []
    for s in c.steps:
        opts_data = []
        for o in s.options:
            opts_data.append({
                'id': o.id,
                'text': o.text,
                'patientResponse': o.patientResponse,
                'emotionClass': o.emotionClass,
                'emotionText': o.emotionText,
                'vitalsHr': o.vitalsHr,
                'scoreDelta': o.scoreDelta,
                'nextStepId': o.nextStepId
            })
        steps_data.append({
            'id': s.id,
            'systemMessage': s.systemMessage,
            'stepOrder': s.stepOrder,
            'options': opts_data
        })
        
    return jsonify({
        'id': c.id,
        'title': c.title,
        'description': c.description,
        'difficulty': c.difficulty,
        'category': c.category,
        'steps': steps_data
    })

@app.route('/api/results', methods=['POST'])
@auth_required
def api_post_results():
    try:
        data = request.get_json()
        score = data.get('score')
        duration = data.get('duration')
        case_id = data.get('caseId')
        
        user = User.query.get(request.user_id)
        
        # Check if already completed this case
        already_done = SimulationResult.query.filter_by(userId=user.id, caseId=case_id).first()
        
        result = SimulationResult(
            id=os.urandom(16).hex(),
            score=score,
            duration=duration,
            userId=user.id,
            caseId=case_id
        )
        db.session.add(result)
        
        if not already_done:
            user.casesDone += 1
            user.points += score
            
        db.session.commit()
        return jsonify({'success': True, 'points': user.points})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Natija saqlanmadi'}), 500

@app.route('/api/ethics', methods=['GET'])
def api_ethics():
    questions = EthicsQuestion.query.all()
    res = []
    for q in questions:
        res.append({
            'id': q.id,
            'question': q.question,
            'lawText': q.lawText,
            'options': q.options,
            'correctAnswer': q.correctAnswer,
            'explanations': q.explanations,
            'explanationCorrect': q.explanationCorrect
        })
    return jsonify(res)

@app.route('/api/ethics-results', methods=['POST'])
@auth_required
def api_post_ethics_results():
    try:
        data = request.get_json()
        score = data.get('score')
        
        user = User.query.get(request.user_id)
        new_count = user.ethicsDone + 1
        new_score = int(((user.ethicsScore * user.ethicsDone) + score) / new_count)
        
        user.ethicsScore = new_score
        user.ethicsDone = new_count
        user.points += int(score / 5)
        
        db.session.commit()
        return jsonify({'success': True, 'ethicsScore': new_score, 'ethicsDone': new_count})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Server error submitting ethics results'}), 500

# Fetch internal volunteer projects
def fetch_volunteer_projects_internal(user_id):
    projects = VolunteerProject.query.order_by(VolunteerProject.createdAt.desc()).all()
    res = []
    for p in projects:
        user_apps = [a.userId for a in p.applications]
        is_applied = user_id in user_apps
        res.append({
            'id': p.id,
            'avatar': p.avatar,
            'title': p.title,
            'description': p.description,
            'date': p.date,
            'location': p.location,
            'slotsMax': p.slotsMax,
            'slotsCurrent': len(p.applications),
            'pointsReward': p.pointsReward,
            'tag': 'Siz Qabul Qilingansiz' if is_applied else 'Yangi',
            'tagClass': 'badge-success' if is_applied else 'badge-primary'
        })
    return res

# Fetch internal volunteer applications
def fetch_volunteer_applications_internal(user_id):
    apps = VolunteerApplication.query.filter_by(userId=user_id).order_by(VolunteerApplication.createdAt.desc()).all()
    res = []
    for a in apps:
        res.append({
            'id': a.id,
            'title': a.project.title,
            'meta': f"{a.createdAt.strftime('%d-%B, %Y')} • +{a.project.pointsReward} ball • Arizangiz qabul qilindi",
            'project': {
                'title': a.project.title,
                'pointsReward': a.project.pointsReward
            }
        })
    return res

@app.route('/api/volunteer/projects', methods=['GET'])
@auth_required
def api_volunteer_projects():
    return jsonify(fetch_volunteer_projects_internal(request.user_id))

@app.route('/api/volunteer/my-applications', methods=['GET'])
@auth_required
def api_volunteer_my_applications():
    return jsonify(fetch_volunteer_applications_internal(request.user_id))

@app.route('/api/volunteer/apply', methods=['POST'])
@auth_required
def api_volunteer_apply():
    try:
        data = request.get_json()
        project_id = data.get('projectId')
        points_reward = data.get('pointsReward')
        
        user = User.query.get(request.user_id)
        
        # Check if already applied
        existing = VolunteerApplication.query.filter_by(projectId=project_id, userId=user.id).first()
        if existing:
            return jsonify({'error': 'Siz ushbu loyihaga allaqachon ariza berib bo\'lgansiz.'}), 400
            
        new_app = VolunteerApplication(
            id=os.urandom(16).hex(),
            projectId=project_id,
            userId=user.id
        )
        db.session.add(new_app)
        user.points += points_reward
        db.session.commit()
        
        return jsonify({'success': True, 'points': user.points})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Server error registering application'}), 500

@app.route('/api/volunteer/projects', methods=['POST'])
@auth_required
def api_create_volunteer_project():
    if request.user_role != 'admin':
        return jsonify({'error': 'Taqqiqlangan'}), 403
    try:
        data = request.get_json()
        avatar = data.get('avatar', '🏥')
        title = data.get('title')
        description = data.get('description')
        date = data.get('date')
        location = data.get('location')
        slots_max = int(data.get('slotsMax', 20))
        points_reward = int(data.get('pointsReward', 500))
        
        new_proj = VolunteerProject(
            id=os.urandom(16).hex(),
            avatar=avatar,
            title=title,
            description=description,
            date=date,
            location=location,
            slotsMax=slots_max,
            pointsReward=points_reward
        )
        db.session.add(new_proj)
        db.session.commit()
        return jsonify({'id': new_proj.id, 'title': new_proj.title})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Loyihani yaratib bo\'lmadi'}), 500

@app.route('/api/volunteer/projects/<proj_id>', methods=['DELETE'])
@auth_required
def api_delete_volunteer_project(proj_id):
    if request.user_role != 'admin':
        return jsonify({'error': 'Taqqiqlangan'}), 403
    try:
        proj = VolunteerProject.query.get_or_404(proj_id)
        db.session.delete(proj)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        print(e)
        return jsonify({'error': 'O\'chirib bo\'lmadi'}), 500


# --- DATA LOGIC AGGREGATORS (Notifications, User Stats) ---

def fetch_notifications_internal(user):
    notifications = []
    
    # 1. Volontyorlik
    apps = VolunteerApplication.query.filter_by(userId=user.id).all()
    for app in apps:
        notifications.append({
            'id': f"vol-{app.id}",
            'icon': app.project.avatar,
            'title': f"Volontyorlik: {app.project.title}",
            'desc': f"Loyihaga arizangiz tasdiqlandi. Sana: {app.project.date}.",
            'time': app.createdAt.strftime('%d-%m-%Y %H:%M'),
            'unread': False,
            'type': 'success'
        })
        
    # 2. Completed cases
    results = SimulationResult.query.filter_by(userId=user.id).order_by(SimulationResult.createdAt.desc()).all()
    for idx, r in enumerate(results):
        notifications.append({
            'id': f"result-{r.id}",
            'icon': '🧬',
            'title': 'Klinik Keys yakunlandi',
            'desc': f'"{r.case.title}" keysini {r.score}% natija bilan yakunladingiz.',
            'time': r.createdAt.strftime('%d-%m-%Y %H:%M'),
            'unread': idx == 0 and (datetime.datetime.utcnow() - r.createdAt).seconds < 600,
            'type': 'success' if r.score >= 80 else ('primary' if r.score >= 60 else 'warning')
        })
        
    # 3. Ethics Done
    if user.ethicsDone > 0:
        notifications.append({
            'id': 'ethics-summary',
            'icon': '🛡️',
            'title': 'Etiko-deontologik testlar',
            'desc': f'Siz jami {user.ethicsDone} marta etika testlarini topshirdingiz. O\'rtacha: {user.ethicsScore}%.',
            'time': 'Faol',
            'unread': False,
            'type': 'success' if user.ethicsScore >= 80 else 'primary'
        })
        
    # 4. Achievements
    if user.casesDone >= 1:
        notifications.append({
            'id': 'ach-1',
            'icon': '🏆',
            'title': 'Yangi yutuq ochildi!',
            'desc': 'Birinchi keysni yakunlaganingiz uchun "Birinchi Keys" yutug\'ini oldingiz.',
            'time': 'Faol',
            'unread': False,
            'type': 'success'
        })
        
    return notifications

@app.route('/api/notifications', methods=['GET'])
@auth_required
def api_notifications():
    user = User.query.get(request.user_id)
    return jsonify(fetch_notifications_internal(user))

def fetch_user_stats_internal(user):
    total_cases = Case.query.filter_by(isActive=True).count()
    results = SimulationResult.query.filter_by(userId=user.id).all()
    
    avg_clinical = 0
    if len(results) > 0:
        avg_clinical = int(sum([r.score for r in results]) / len(results))
        
    weekly_hours = 12
    weekly_data = [1.5, 2.3, 3.0, 1.8, 2.5, 3.2, 1.0]
    
    # Timeline
    timeline = []
    for r in results[:5]:
        timeline.append({
            'title': f'"{r.case.title}" keysini yakunladi — {r.score}%',
            'time': r.createdAt.strftime('%d-%m-%Y %H:%M'),
            'color': 'var(--green)' if r.score >= 80 else 'var(--primary)'
        })
    if user.ethicsDone > 0:
        timeline.append({
            'title': f'Etika testini topshirdi — {user.ethicsScore}%',
            'time': 'Yaqinda',
            'color': 'var(--secondary)'
        })
        
    # Achievements
    achievements = [
        {'emoji': '🏆', 'title': 'Birinchi Keys', 'earned': user.casesDone >= 1},
        {'emoji': '🎯', 'title': '10 ta Simulyatsiya', 'earned': user.casesDone >= 10},
        {'emoji': '⭐', 'title': 'Etika Ustasi', 'earned': user.ethicsScore >= 90 and user.ethicsDone >= 5},
        {'emoji': '🔬', 'title': 'Lab Tadqiqotchi', 'earned': len(results) >= 3},
        {'emoji': '💡', 'title': 'Tez Fikrlovchi', 'earned': any([r.duration < 10 for r in results])},
        {'emoji': '🏅', 'title': '100% Aniqlik', 'earned': any([r.score == 100 for r in results])}
    ]
    
    # Checklist goals
    goals = [
        {'text': 'Ertalabki etika viktorinasini yakunlash', 'done': user.ethicsDone >= 1},
        {'text': 'Bemor muloqoti simulyatsiyasi', 'done': user.casesDone >= 1},
        {'text': 'Tibbiy etika qonunlarini o\'rganish', 'done': user.ethicsScore >= 70},
        {'text': 'Laboratoriya xulosalarini tasdiqlash', 'done': user.casesDone >= 1},
        {'text': 'Barcha keyslarni muvaffaqiyatli yakunlash', 'done': user.casesDone == total_cases and total_cases > 0}
    ]
    
    # Radar chart scores
    radar = {
        'diagnostics': min(100, int(avg_clinical * 0.95)) if avg_clinical else 50,
        'treatment': min(100, int(avg_clinical * 0.9)) if avg_clinical else 50,
        'communication': min(100, int(avg_clinical * 1.05)) if avg_clinical else 50,
        'ethics': user.ethicsScore or 50,
        'law': min(100, int(user.ethicsScore * 0.9)) if user.ethicsScore else 50
    }
    
    return {
        'completedCases': user.casesDone,
        'totalCases': total_cases,
        'ethicsScore': user.ethicsScore,
        'clinicalScore': avg_clinical or 50,
        'weeklyHours': weekly_hours,
        'weeklyData': weekly_data,
        'goals': goals,
        'achievements': achievements,
        'timeline': timeline,
        'radar': radar
    }

@app.route('/api/user/stats', methods=['GET'])
@auth_required
def api_user_stats():
    user = User.query.get(request.user_id)
    return jsonify(fetch_user_stats_internal(user))


# Seed initial volunteer projects if they don't exist
with app.app_context():
    # In Flask-SQLAlchemy, if tables already exist, this does not overwrite them
    db.create_all()
    
    # Seed initial volunteer projects if database table is empty
    count = VolunteerProject.query.count()
    if count == 0:
        db.session.add_all([
            VolunteerProject(
                id='charity',
                avatar='🏥',
                title='Shifoxona Xayriya Tashrifi',
                description='Bemor bolalar kayfiyatini ko\'tarish va ularga psixologik yordam ko\'rsatish dasturi.',
                date='20-Iyul, 2026 • 09:00 - 13:00',
                location='Shahar Bolalar Shifoxonasi №3',
                slotsMax=20,
                pointsReward=500
            ),
            VolunteerProject(
                id='blood',
                avatar='❤️',
                title='Qon Topshirish Aksiyasi',
                description='"Donor bo\'l - hayot qutqar!" shiori ostida markaziy qon quyish stansiyasida yordam.',
                date='1-Avgust, 2026 • 08:00 - 15:00',
                location='Respublika Qon Markazi',
                slotsMax=50,
                pointsReward=400
            ),
            VolunteerProject(
                id='education',
                avatar='📚',
                title='Maktablarda Tibbiy Ta\'lim',
                description='Maktab o\'quvchilariga birinchi yordam ko\'rsatish bo\'yicha amaliy mashg\'ulotlar o\'tish.',
                date='25-Iyul, 2026 • 14:00 - 16:00',
                location='15-umumiy o\'rta ta\'lim maktabi',
                slotsMax=10,
                pointsReward=600
            )
        ])
        db.session.commit()
        print('🌱 Volunteer projects database seeded.')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
