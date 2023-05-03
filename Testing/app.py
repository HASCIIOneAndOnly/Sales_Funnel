from flask import send_from_directory
from models import Deal
from flask import jsonify, request
from models import Deal, db
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://amepifanov:fhntv2003@localhost:5050/course_project_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


@app.before_first_request
def create_tables():
    db.create_all()


@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)


@app.route('/search_deals', methods=['GET'])
def search_deals():
    query = request.args.get('query', '')
    deals = Deal.query.filter(Deal.name.ilike(f"%{query}%")).all()
    deals_list = []

    for deal in deals:
        deal_data = {
            'id': deal.id,
            'name': deal.name,
            'stage': deal.stage,
            'cost': str(deal.cost),
            'created_date': deal.created_date.strftime("%Y-%m-%d"),
            'client_name': deal.client_name,
            'additional_info': deal.additional_info
        }
        deals_list.append(deal_data)

    return jsonify(deals_list)



@app.route('/add_deal', methods=['POST'])
def add_deal():
    try:
        # Получение данных о сделке из запроса
        name = request.form['name']
        stage = request.form['stage']
        cost = request.form['cost']
        created_date = request.form['created_date']
        client_name = request.form['client_name']
        additional_info = request.form.get(
            'additional_info', None)  # Может быть пустым

        # Создание и сохранение сделки
        deal = Deal(name=name, stage=stage, cost=cost, created_date=created_date,
                    client_name=client_name, additional_info=additional_info)
        db.session.add(deal)
        db.session.commit()

        return jsonify({'message': 'Сделка успешно добавлена'}), 201
    except Exception as error:
        return jsonify({'message': f'Ошибка при добавлении сделки: {error}'}), 400



@app.route('/deals/<string:stage>', methods=['GET'])
def get_deals_by_stage(stage):
    deals = Deal.query.filter_by(stage=stage).all()
    deals_list = []

    for deal in deals:
        deal_data = {
            'id': deal.id,
            'name': deal.name,
            'stage': deal.stage,
            'cost': str(deal.cost),
            'created_date': deal.created_date.strftime("%Y-%m-%d"),
            'client_name': deal.client_name,
            'additional_info': deal.additional_info
        }
        deals_list.append(deal_data)

    return jsonify(deals_list)


if __name__ == "__main__":
    app.run(debug=True, port=5600)
