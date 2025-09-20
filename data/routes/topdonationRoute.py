from flask import Flask, Blueprint
from controller.topdonationController import TopdonationController

topdonation_bp = Blueprint('topdonation', __name__)

# Database management
@topdonation_bp.route('/create_table', methods=['POST'])
def create_table():
    return TopdonationController.create_table()

# Donation operations
@topdonation_bp.route('/add_donation', methods=['POST'])
def add_donation():
    return TopdonationController.add_donation()

@topdonation_bp.route('/get_top_donations', methods=['GET'])
def get_top_donations():
    return TopdonationController.get_top_donations()

@topdonation_bp.route('/get_total_amount', methods=['GET'])
def get_total_amount():
    return TopdonationController.get_total_amount()

@topdonation_bp.route('/get_donation_by_transaction_id', methods=['GET'])
def get_donation_by_transaction_id():
    return TopdonationController.get_donation_by_transaction_id()

@topdonation_bp.route('/delete_donation', methods=['DELETE'])
def delete_donation():
    return TopdonationController.delete_donation_by_id()

@topdonation_bp.route('/get_donation_by_id', methods=['GET'])
def get_donation_by_id():
    return TopdonationController.get_donation_by_id()

# Campaign operations
@topdonation_bp.route('/get_campaign_progress', methods=['GET'])
def get_campaign_progress():
    return TopdonationController.get_campaign_progress()

@topdonation_bp.route('/get_campaign_settings', methods=['GET'])
def get_campaign_settings():
    return TopdonationController.get_campaign_settings()

@topdonation_bp.route('/update_campaign_settings', methods=['PUT'])
def update_campaign_settings():
    return TopdonationController.update_campaign_settings()
