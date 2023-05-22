from flask import Flask
from flask import jsonify, request, render_template

from models import Deal, db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://amepifanov:fhntv2003@localhost:5050/course_project_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


def create_tables():
    db.create_all()


def make_deals_list(deals):
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
    return deals_list


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/search_deals', methods=['GET'])
def search_deals():
    query = request.args.get('query', '')
    deals = Deal.query.filter(Deal.name.ilike(f"%{query}%")).all()
    return jsonify(make_deals_list(deals))


@app.route('/deals/<string:stage>', methods=['GET'])
def get_deals_by_stage(stage):
    deals = Deal.query.filter_by(stage=stage).all()
    return jsonify(make_deals_list(deals))


if __name__ == "__main__":
    with app.app_context():
        create_tables()
    app.run(debug=True, port=5800)
