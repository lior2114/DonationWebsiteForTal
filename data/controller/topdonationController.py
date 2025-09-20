import sqlite3
import datetime
from models.topdonationModel import Topdonation
from flask import request, jsonify

class TopdonationController:
    @staticmethod
    def create_table():
        """יצירת טבלת התרומות"""
        try:
            Topdonation.create_table()
            return jsonify({"message": "Table created successfully"}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def add_donation():
        """הוספת תרומה חדשה"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data provided"}), 400
            
            amount = data.get("amount")
            if not amount:
                return jsonify({"error": "Amount is required"}), 400
            
            # וידוא שהסכום הוא מספר חיובי
            try:
                amount = int(amount)
                if amount <= 0:
                    return jsonify({"error": "Amount must be positive"}), 400
            except (ValueError, TypeError):
                return jsonify({"error": "Amount must be a valid number"}), 400
            
            result = Topdonation.add_donation(data)
            return jsonify(result), 201
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_top_donations():
        """קבלת התרומות המובילות"""
        try:
            limit = request.args.get('limit', 10, type=int)
            donations = Topdonation.get_top_donations(limit)
            return jsonify({"donations": donations}), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_total_amount():
        """קבלת סכום התרומות הכולל"""
        try:
            total = Topdonation.get_total_amount()
            return jsonify({"total_amount": total}), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_campaign_progress():
        """קבלת התקדמות הקמפיין"""
        try:
            progress = Topdonation.get_campaign_progress()
            return jsonify(progress), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_campaign_settings():
        """קבלת הגדרות הקמפיין"""
        try:
            settings = Topdonation.get_campaign_settings()
            return jsonify(settings), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def update_campaign_settings():
        """עדכון הגדרות הקמפיין"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data provided"}), 400
            
            result = Topdonation.update_campaign_settings(data)
            return jsonify(result), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_donation_by_transaction_id():
        """קבלת תרומה לפי transaction ID"""
        try:
            transaction_id = request.args.get('transaction_id')
            if not transaction_id:
                return jsonify({"error": "Transaction ID is required"}), 400
            
            donation = Topdonation.get_donation_by_transaction_id(transaction_id)
            if donation:
                return jsonify({"donation": donation}), 200
            else:
                return jsonify({"error": "Donation not found"}), 404
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def delete_donation_by_id():
        """מחיקת תרומה לפי ID"""
        try:
            donation_id = request.args.get('id')
            if not donation_id:
                return jsonify({"error": "Donation ID is required"}), 400
            
            try:
                donation_id = int(donation_id)
            except ValueError:
                return jsonify({"error": "Invalid donation ID"}), 400
            
            result = Topdonation.delete_donation_by_id(donation_id)
            if result["deleted_rows"] > 0:
                return jsonify(result), 200
            else:
                return jsonify({"error": "Donation not found"}), 404
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_donation_by_id():
        """קבלת תרומה לפי ID"""
        try:
            donation_id = request.args.get('id')
            if not donation_id:
                return jsonify({"error": "Donation ID is required"}), 400
            
            try:
                donation_id = int(donation_id)
            except ValueError:
                return jsonify({"error": "Invalid donation ID"}), 400
            
            donation = Topdonation.get_donation_by_id(donation_id)
            if donation:
                return jsonify({"donation": donation}), 200
            else:
                return jsonify({"error": "Donation not found"}), 404
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500