import sqlite3

class Topdonation:
    @staticmethod
    def connect_to_db():
        conn = sqlite3.connect('data/data.db')
        cursor = conn.cursor()
        return conn, cursor

    @staticmethod
    def create_table():
        conn, cursor = Topdonation.connect_to_db()
        
        # טבלת תרומות מורחבת
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS donations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL DEFAULT 'אנונימי',
                amount INTEGER NOT NULL,
                email TEXT,
                phone TEXT,
                message TEXT,
                transaction_id TEXT UNIQUE,
                payment_method TEXT,
                status TEXT DEFAULT 'completed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )''')
        
        # טבלת הגדרות קמפיין
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS campaign_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                goal INTEGER DEFAULT 200000,
                currency TEXT DEFAULT 'ILS',
                min_donation INTEGER DEFAULT 10,
                title TEXT DEFAULT 'קמפיין התרומות שלנו',
                description TEXT DEFAULT 'עזרו לנו להגיע למטרה שלנו',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )''')
        
        # הוספת הגדרות ברירת מחדל אם הטבלה ריקה
        cursor.execute('SELECT COUNT(*) FROM campaign_settings')
        if cursor.fetchone()[0] == 0:
            cursor.execute('''
                INSERT INTO campaign_settings (goal, currency, min_donation, title, description)
                VALUES (200000, 'ILS', 10, 'קמפיין התרומות שלנו', 'עזרו לנו להגיע למטרה שלנו')
            ''')
        
        conn.commit()
        cursor.close()
        conn.close()
        return {"Message": "Tables created successfully"}

    @staticmethod
    def add_donation(donation_data):
        """הוספת תרומה חדשה עם כל הפרטים"""
        conn, cursor = Topdonation.connect_to_db()
        try:
            cursor.execute('''
                INSERT INTO donations (name, amount, email, phone, message, transaction_id, payment_method, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                donation_data.get('name', 'אנונימי'),
                donation_data.get('amount'),
                donation_data.get('email'),
                donation_data.get('phone'),
                donation_data.get('message'),
                donation_data.get('transaction_id'),
                donation_data.get('payment_method', 'credit_card'),
                donation_data.get('status', 'completed')
            ))
            donation_id = cursor.lastrowid
            conn.commit()
            return {"message": "Donation added successfully", "id": donation_id}
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()
            conn.close()



    @staticmethod
    def get_top_donations(limit=10):
        """קבלת התרומות המובילות (ללא עדכונים ידניים)"""
        conn, cursor = Topdonation.connect_to_db()
        cursor.execute('''
            SELECT id, name, amount, created_at, message
            FROM donations 
            WHERE status = 'completed' 
            AND name NOT IN ('עדכון ידני', 'החסרה ידנית')
            ORDER BY amount DESC 
            LIMIT ?
        ''', (limit,))
        
        donations = []
        for row in cursor.fetchall():
            name = row[1]
            # בדיקה אם זה תורם אנונימי
            is_anonymous = name == 'תורם אנונימי' or name == 'אנונימי'
            
            donations.append({
                'id': row[0],
                'name': name,
                'amount': row[2],
                'timestamp': row[3],
                'message': row[4],
                'anonymous': is_anonymous
            })
        
        cursor.close()
        conn.close()
        return donations

    @staticmethod
    def get_total_amount():
        """קבלת סכום התרומות הכולל"""
        conn, cursor = Topdonation.connect_to_db()
        cursor.execute('''
            SELECT SUM(amount) 
            FROM donations
            WHERE status = 'completed'
        ''')
        total = cursor.fetchone()[0] or 0
        cursor.close()
        conn.close()
        return total

    @staticmethod
    def get_donation_count():
        """קבלת מספר התרומות"""
        conn, cursor = Topdonation.connect_to_db()
        cursor.execute('SELECT COUNT(*) FROM donations WHERE status = "completed"')
        count = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        return count

    @staticmethod
    def get_campaign_progress():
        """קבלת התקדמות הקמפיין"""
        conn, cursor = Topdonation.connect_to_db()
        
        # קבלת סכום כולל ומספר תרומות
        cursor.execute('''
            SELECT SUM(amount), COUNT(*) 
            FROM donations 
            WHERE status = 'completed'
        ''')
        total_amount, total_donations = cursor.fetchone()
        total_amount = total_amount or 0
        
        # קבלת מטרת הקמפיין
        cursor.execute('SELECT goal FROM campaign_settings LIMIT 1')
        goal_row = cursor.fetchone()
        goal = goal_row[0] if goal_row else 200000
        
        cursor.close()
        conn.close()
        
        progress = (total_amount / goal) * 100 if goal > 0 else 0
        
        return {
            'total_amount': total_amount,
            'total_donations': total_donations,
            'goal': goal,
            'progress': round(progress, 2)
        }

    @staticmethod
    def get_campaign_settings():
        """קבלת הגדרות הקמפיין"""
        conn, cursor = Topdonation.connect_to_db()
        cursor.execute('''
            SELECT goal, currency, min_donation, title, description 
            FROM campaign_settings 
            LIMIT 1
        ''')
        settings = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if settings:
            return {
                'goal': settings[0],
                'currency': settings[1],
                'min_donation': settings[2],
                'title': settings[3],
                'description': settings[4]
            }
        else:
            return {
                'goal': 200000,
                'currency': 'ILS',
                'min_donation': 10,
                'title': 'קמפיין התרומות שלנו',
                'description': 'עזרו לנו להגיע למטרה שלנו'
            }

    @staticmethod
    def update_campaign_settings(settings):
        """עדכון הגדרות הקמפיין"""
        conn, cursor = Topdonation.connect_to_db()
        try:
            cursor.execute('''
                UPDATE campaign_settings 
                SET goal = ?, currency = ?, min_donation = ?, title = ?, description = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = 1
            ''', (
                settings.get('goal'),
                settings.get('currency'),
                settings.get('min_donation'),
                settings.get('title'),
                settings.get('description')
            ))
            conn.commit()
            return {"message": "Campaign settings updated successfully"}
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_donation_by_transaction_id(transaction_id):
        """קבלת תרומה לפי transaction ID"""
        conn, cursor = Topdonation.connect_to_db()
        cursor.execute('''
            SELECT id, name, amount, email, phone, message, transaction_id, payment_method, status, created_at
            FROM donations 
            WHERE transaction_id = ?
        ''', (transaction_id,))
        
        donation = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if donation:
            return {
                'id': donation[0],
                'name': donation[1],
                'amount': donation[2],
                'email': donation[3],
                'phone': donation[4],
                'message': donation[5],
                'transaction_id': donation[6],
                'payment_method': donation[7],
                'status': donation[8],
                'created_at': donation[9]
            }
        return None

    @staticmethod
    def delete_donation_by_id(donation_id):
        """מחיקת תרומה לפי ID"""
        conn, cursor = Topdonation.connect_to_db()
        try:
            cursor.execute('DELETE FROM donations WHERE id = ?', (donation_id,))
            deleted_rows = cursor.rowcount
            conn.commit()
            return {"message": "Donation deleted successfully", "deleted_rows": deleted_rows}
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_donation_by_id(donation_id):
        """קבלת תרומה לפי ID"""
        conn, cursor = Topdonation.connect_to_db()
        cursor.execute('''
            SELECT id, name, amount, email, phone, message, transaction_id, payment_method, status, created_at
            FROM donations 
            WHERE id = ?
        ''', (donation_id,))
        
        donation = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if donation:
            return {
                'id': donation[0],
                'name': donation[1],
                'amount': donation[2],
                'email': donation[3],
                'phone': donation[4],
                'message': donation[5],
                'transaction_id': donation[6],
                'payment_method': donation[7],
                'status': donation[8],
                'created_at': donation[9]
            }
        return None
