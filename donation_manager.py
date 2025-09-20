#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
מנהל תרומות - כלי ניהול לאתר התרומות
"""

import tkinter as tk
from tkinter import ttk, messagebox
import sqlite3
import requests
import json
from datetime import datetime

class DonationManager:
    def __init__(self, root):
        self.root = root
        self.root.title("מנהל תרומות - אתר התרומות לטל")
        self.root.geometry("800x600")
        self.root.configure(bg='#f0f0f0')
        
        # הגדרות
        self.db_path = "data/data.db"
        self.api_base_url = "http://localhost:5000"
        
        # יצירת הממשק
        self.create_widgets()
        
        # טעינת נתונים
        self.load_data()
    
    def create_widgets(self):
        # כותרת ראשית
        title_frame = tk.Frame(self.root, bg='#2c3e50', height=60)
        title_frame.pack(fill='x', padx=10, pady=5)
        title_frame.pack_propagate(False)
        
        title_label = tk.Label(title_frame, text="מנהל תרומות - אתר התרומות לטל", 
                              font=('Arial', 16, 'bold'), fg='white', bg='#2c3e50')
        title_label.pack(expand=True)
        
        # מסגרת ראשית
        main_frame = tk.Frame(self.root, bg='#f0f0f0')
        main_frame.pack(fill='both', expand=True, padx=10, pady=5)
        
        # סעיף עדכון סכום כולל
        self.create_total_amount_section(main_frame)
        
        # סעיף הוספת תורם
        self.create_donor_section(main_frame)
        
        # סעיף רשימת תורמים
        self.create_donors_list_section(main_frame)
    
    def create_total_amount_section(self, parent):
        # מסגרת סכום כולל
        total_frame = tk.LabelFrame(parent, text="סכום כולל שנאסף", font=('Arial', 12, 'bold'), 
                                   bg='#f0f0f0', fg='#2c3e50')
        total_frame.pack(fill='x', pady=5)
        
        # סכום נוכחי
        current_frame = tk.Frame(total_frame, bg='#f0f0f0')
        current_frame.pack(fill='x', padx=10, pady=5)
        
        tk.Label(current_frame, text="סכום נוכחי:", font=('Arial', 10, 'bold'), 
                bg='#f0f0f0').pack(side='right')
        
        self.current_amount_var = tk.StringVar()
        self.current_amount_label = tk.Label(current_frame, textvariable=self.current_amount_var, 
                                           font=('Arial', 12), fg='#27ae60', bg='#f0f0f0')
        self.current_amount_label.pack(side='right', padx=5)
        
        # כפתור רענון סכום
        refresh_amount_btn = tk.Button(current_frame, text="רענן סכום", command=self.refresh_amount,
                                     bg='#9b59b6', fg='white', font=('Arial', 9, 'bold'))
        refresh_amount_btn.pack(side='right', padx=5)
        
        # עדכון סכום
        update_frame = tk.Frame(total_frame, bg='#f0f0f0')
        update_frame.pack(fill='x', padx=10, pady=5)
        
        tk.Label(update_frame, text="הוסף סכום:", font=('Arial', 10), 
                bg='#f0f0f0').pack(side='right')
        
        self.amount_entry = tk.Entry(update_frame, font=('Arial', 12), width=15)
        self.amount_entry.pack(side='right', padx=5)
        
        update_btn = tk.Button(update_frame, text="הוסף", command=self.update_total_amount,
                              bg='#3498db', fg='white', font=('Arial', 10, 'bold'))
        update_btn.pack(side='right', padx=5)
        
        subtract_btn = tk.Button(update_frame, text="החסר", command=self.subtract_total_amount,
                                bg='#f39c12', fg='white', font=('Arial', 10, 'bold'))
        subtract_btn.pack(side='right', padx=5)
        
        reset_btn = tk.Button(update_frame, text="איפוס סכום", command=self.reset_total_amount,
                             bg='#e74c3c', fg='white', font=('Arial', 10, 'bold'))
        reset_btn.pack(side='right', padx=5)
    
    def create_donor_section(self, parent):
        # מסגרת הוספת תורם
        donor_frame = tk.LabelFrame(parent, text="הוספת תורם חדש", font=('Arial', 12, 'bold'), 
                                   bg='#f0f0f0', fg='#2c3e50')
        donor_frame.pack(fill='x', pady=5)
        
        # פרטי תורם
        details_frame = tk.Frame(donor_frame, bg='#f0f0f0')
        details_frame.pack(fill='x', padx=10, pady=5)
        
        # שם פרטי
        name_frame = tk.Frame(details_frame, bg='#f0f0f0')
        name_frame.pack(fill='x', pady=2)
        
        tk.Label(name_frame, text="שם פרטי:", font=('Arial', 10), 
                bg='#f0f0f0').pack(side='right')
        self.first_name_entry = tk.Entry(name_frame, font=('Arial', 12), width=20)
        self.first_name_entry.pack(side='right', padx=5)
        
        # שם משפחה
        last_name_frame = tk.Frame(details_frame, bg='#f0f0f0')
        last_name_frame.pack(fill='x', pady=2)
        
        tk.Label(last_name_frame, text="שם משפחה:", font=('Arial', 10), 
                bg='#f0f0f0').pack(side='right')
        self.last_name_entry = tk.Entry(last_name_frame, font=('Arial', 12), width=20)
        self.last_name_entry.pack(side='right', padx=5)
        
        # סכום תרומה
        amount_frame = tk.Frame(details_frame, bg='#f0f0f0')
        amount_frame.pack(fill='x', pady=2)
        
        tk.Label(amount_frame, text="סכום תרומה (₪):", font=('Arial', 10), 
                bg='#f0f0f0').pack(side='right')
        self.donor_amount_entry = tk.Entry(amount_frame, font=('Arial', 12), width=15)
        self.donor_amount_entry.pack(side='right', padx=5)
        
        # הודעה
        message_frame = tk.Frame(details_frame, bg='#f0f0f0')
        message_frame.pack(fill='x', pady=2)
        
        tk.Label(message_frame, text="הודעה (אופציונלי):", font=('Arial', 10), 
                bg='#f0f0f0').pack(side='right')
        self.message_entry = tk.Entry(message_frame, font=('Arial', 12), width=30)
        self.message_entry.pack(side='right', padx=5)
        
        # כפתורים
        buttons_frame = tk.Frame(donor_frame, bg='#f0f0f0')
        buttons_frame.pack(fill='x', padx=10, pady=5)
        
        add_donor_btn = tk.Button(buttons_frame, text="הוסף תורם", command=self.add_donor,
                                 bg='#27ae60', fg='white', font=('Arial', 10, 'bold'))
        add_donor_btn.pack(side='right', padx=5)
        
        anonymous_btn = tk.Button(buttons_frame, text="תורם אנונימי", command=self.add_anonymous_donor,
                                 bg='#e67e22', fg='white', font=('Arial', 10, 'bold'))
        anonymous_btn.pack(side='right', padx=5)
    
    def create_donors_list_section(self, parent):
        # מסגרת רשימת תורמים
        list_frame = tk.LabelFrame(parent, text="רשימת תורמים", font=('Arial', 12, 'bold'), 
                                  bg='#f0f0f0', fg='#2c3e50')
        list_frame.pack(fill='both', expand=True, pady=5)
        
        # טבלת תורמים
        columns = ('שם', 'סכום', 'הודעה', 'תאריך')
        self.donors_tree = ttk.Treeview(list_frame, columns=columns, show='headings', height=10)
        
        # הגדרת עמודות
        self.donors_tree.heading('שם', text='שם')
        self.donors_tree.heading('סכום', text='סכום (₪)')
        self.donors_tree.heading('הודעה', text='הודעה')
        self.donors_tree.heading('תאריך', text='תאריך')
        
        # רוחב עמודות
        self.donors_tree.column('שם', width=200)
        self.donors_tree.column('סכום', width=100)
        self.donors_tree.column('הודעה', width=200)
        self.donors_tree.column('תאריך', width=120)
        
        # גלילה
        scrollbar = ttk.Scrollbar(list_frame, orient='vertical', command=self.donors_tree.yview)
        self.donors_tree.configure(yscrollcommand=scrollbar.set)
        
        self.donors_tree.pack(side='right', fill='both', expand=True, padx=5, pady=5)
        scrollbar.pack(side='left', fill='y')
        
        # כפתורי פעולה
        buttons_frame = tk.Frame(list_frame, bg='#f0f0f0')
        buttons_frame.pack(pady=5)
        
        refresh_btn = tk.Button(buttons_frame, text="רענן רשימה", command=self.load_donors,
                               bg='#9b59b6', fg='white', font=('Arial', 10, 'bold'))
        refresh_btn.pack(side='right', padx=5)
        
        delete_btn = tk.Button(buttons_frame, text="מחק תורם נבחר", command=self.delete_selected_donor,
                              bg='#e74c3c', fg='white', font=('Arial', 10, 'bold'))
        delete_btn.pack(side='right', padx=5)
    
    def load_data(self):
        """טעינת נתונים מהשרת"""
        try:
            response = requests.get(f"{self.api_base_url}/get_campaign_progress")
            if response.status_code == 200:
                data = response.json()
                self.current_amount_var.set(f"{data['total_amount']:,} ₪")
            else:
                self.current_amount_var.set("שגיאה בטעינה")
        except Exception as e:
            self.current_amount_var.set("לא ניתן להתחבר לשרת")
            print(f"Error loading data: {e}")
        
        self.load_donors()
    
    def refresh_amount(self):
        """רענון סכום נוכחי"""
        try:
            response = requests.get(f"{self.api_base_url}/get_campaign_progress")
            if response.status_code == 200:
                data = response.json()
                self.current_amount_var.set(f"{data['total_amount']:,} ₪")
                messagebox.showinfo("רענון", f"הסכום הנוכחי: {data['total_amount']:,} ₪")
            else:
                self.current_amount_var.set("שגיאה בטעינה")
                messagebox.showerror("שגיאה", "שגיאה בטעינת הסכום מהשרת")
        except Exception as e:
            self.current_amount_var.set("לא ניתן להתחבר לשרת")
            messagebox.showerror("שגיאה", f"לא ניתן להתחבר לשרת: {str(e)}")
            print(f"Error refreshing amount: {e}")
    
    def load_donors(self):
        """טעינת רשימת תורמים (ללא עדכונים ידניים)"""
        # ניקוי הטבלה
        for item in self.donors_tree.get_children():
            self.donors_tree.delete(item)
        
        try:
            response = requests.get(f"{self.api_base_url}/get_top_donations?limit=100")
            if response.status_code == 200:
                data = response.json()
                donors = data.get('donations', [])
                
                for donor in donors:
                    name = f"{donor.get('name', '')}"
                    # סנן תרומות ידניות (עדכון ידני והחסרה ידנית)
                    if name in ['עדכון ידני', 'החסרה ידנית']:
                        continue
                        
                    amount = f"{donor.get('amount', 0):,}"
                    message = donor.get('message', '')
                    date = donor.get('created_at', '')
                    donation_id = donor.get('id', '')
                    
                    # הוספת ID כערך נסתר
                    self.donors_tree.insert('', 'end', values=(name, amount, message, date), tags=(donation_id,))
        except Exception as e:
            print(f"Error loading donors: {e}")
    
    def update_total_amount(self):
        """הוספת סכום לסכום הכולל (לא מופיע ברשימת תורמים)"""
        try:
            amount = float(self.amount_entry.get())
            if amount <= 0:
                messagebox.showerror("שגיאה", "הסכום חייב להיות גדול מ-0")
                return
            
            # הוספת תרומה אנונימית שלא תופיע ברשימת תורמים
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO donations (name, amount, email, phone, message, transaction_id, payment_method, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', ('עדכון ידני', amount, '', '', 'הוספת סכום ידני', f"manual_add_{datetime.now().strftime('%Y%m%d%H%M%S')}", 
                  'manual', 'completed', datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
            
            conn.commit()
            conn.close()
            
            # רענון נתונים
            self.load_data()
            self.amount_entry.delete(0, 'end')
            
            messagebox.showinfo("הצלחה", f"נוסף {amount:,} ₪ לסכום הכולל")
            
        except ValueError:
            messagebox.showerror("שגיאה", "אנא הזן סכום תקין")
        except Exception as e:
            messagebox.showerror("שגיאה", f"שגיאה בהוספה: {str(e)}")
    
    def subtract_total_amount(self):
        """החסרת סכום מהסכום הכולל (לא מופיע ברשימת תורמים)"""
        try:
            amount = float(self.amount_entry.get())
            if amount <= 0:
                messagebox.showerror("שגיאה", "הסכום חייב להיות גדול מ-0")
                return
            
            # בדיקה שהסכום לא גדול מהסכום הכולל
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT COALESCE(SUM(amount), 0) FROM donations')
            current_total = cursor.fetchone()[0]
            
            if amount > current_total:
                messagebox.showerror("שגיאה", f"לא ניתן להחסיר {amount:,} ₪ - הסכום הכולל הוא רק {current_total:,} ₪")
                conn.close()
                return
            
            # הוספת תרומה שלילית (החסרה)
            cursor.execute('''
                INSERT INTO donations (name, amount, email, phone, message, transaction_id, payment_method, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', ('החסרה ידנית', -amount, '', '', 'החסרת סכום ידני', f"manual_subtract_{datetime.now().strftime('%Y%m%d%H%M%S')}", 
                  'manual', 'completed', datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
            
            conn.commit()
            conn.close()
            
            # רענון נתונים
            self.load_data()
            self.amount_entry.delete(0, 'end')
            
            messagebox.showinfo("הצלחה", f"הוחסר {amount:,} ₪ מהסכום הכולל")
            
        except ValueError:
            messagebox.showerror("שגיאה", "אנא הזן סכום תקין")
        except Exception as e:
            messagebox.showerror("שגיאה", f"שגיאה בהחסרה: {str(e)}")
    
    def add_donor(self):
        """הוספת תורם חדש"""
        try:
            first_name = self.first_name_entry.get().strip()
            last_name = self.last_name_entry.get().strip()
            amount = float(self.donor_amount_entry.get())
            message = self.message_entry.get().strip()
            
            if not first_name or not last_name:
                messagebox.showerror("שגיאה", "אנא הזן שם פרטי ושם משפחה")
                return
            
            if amount <= 0:
                messagebox.showerror("שגיאה", "הסכום חייב להיות גדול מ-0")
                return
            
            # הוספה למסד הנתונים
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            full_name = f"{first_name} {last_name}"
            cursor.execute('''
                INSERT INTO donations (name, amount, email, phone, message, transaction_id, payment_method, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (full_name, amount, '', '', message, f"manual_{datetime.now().strftime('%Y%m%d%H%M%S')}", 
                  'manual', 'completed', datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
            
            conn.commit()
            conn.close()
            
            # ניקוי שדות
            self.first_name_entry.delete(0, 'end')
            self.last_name_entry.delete(0, 'end')
            self.donor_amount_entry.delete(0, 'end')
            self.message_entry.delete(0, 'end')
            
            # רענון נתונים
            self.load_data()
            
            messagebox.showinfo("הצלחה", f"התורם {full_name} נוסף בהצלחה")
            
        except ValueError:
            messagebox.showerror("שגיאה", "אנא הזן סכום תקין")
        except Exception as e:
            messagebox.showerror("שגיאה", f"שגיאה בהוספת תורם: {str(e)}")
    
    def add_anonymous_donor(self):
        """הוספת תורם אנונימי"""
        try:
            amount = float(self.donor_amount_entry.get())
            message = self.message_entry.get().strip()
            
            if amount <= 0:
                messagebox.showerror("שגיאה", "הסכום חייב להיות גדול מ-0")
                return
            
            # הוספה למסד הנתונים
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO donations (name, amount, email, phone, message, transaction_id, payment_method, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', ('תורם אנונימי', amount, '', '', message, f"manual_{datetime.now().strftime('%Y%m%d%H%M%S')}", 
                  'manual', 'completed', datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
            
            conn.commit()
            conn.close()
            
            # ניקוי שדות
            self.donor_amount_entry.delete(0, 'end')
            self.message_entry.delete(0, 'end')
            
            # רענון נתונים
            self.load_data()
            
            messagebox.showinfo("הצלחה", f"תורם אנונימי נוסף בהצלחה")
            
        except ValueError:
            messagebox.showerror("שגיאה", "אנא הזן סכום תקין")
        except Exception as e:
            messagebox.showerror("שגיאה", f"שגיאה בהוספת תורם: {str(e)}")
    
    def reset_total_amount(self):
        """איפוס סכום כולל"""
        result = messagebox.askyesno("אישור איפוס", 
                                   "האם אתה בטוח שברצונך לאפס את כל התרומות?\nפעולה זו תמחק את כל התרומות ולא ניתן לבטל אותה!")
        
        if result:
            try:
                # מחיקת כל התרומות
                conn = sqlite3.connect(self.db_path)
                cursor = conn.cursor()
                
                cursor.execute('DELETE FROM donations')
                conn.commit()
                conn.close()
                
                # רענון נתונים
                self.load_data()
                
                messagebox.showinfo("הצלחה", "כל התרומות נמחקו בהצלחה")
                
            except Exception as e:
                messagebox.showerror("שגיאה", f"שגיאה באיפוס: {str(e)}")
    
    def delete_selected_donor(self):
        """מחיקת תורם נבחר"""
        selected_item = self.donors_tree.selection()
        
        if not selected_item:
            messagebox.showwarning("אזהרה", "אנא בחר תורם למחיקה")
            return
        
        # קבלת פרטי התורם הנבחר
        item_values = self.donors_tree.item(selected_item[0])['values']
        donor_name = item_values[0]
        donor_amount = item_values[1]
        
        # קבלת ה-ID מהתגים
        item_tags = self.donors_tree.item(selected_item[0])['tags']
        if not item_tags or not item_tags[0]:
            messagebox.showerror("שגיאה", "לא ניתן לקבל את מזהה התרומה")
            return
        
        donation_id = item_tags[0]
        
        result = messagebox.askyesno("אישור מחיקה", 
                                   f"האם אתה בטוח שברצונך למחוק את התורם:\n{donor_name} - {donor_amount} ₪")
        
        if result:
            try:
                # מחיקה דרך ה-API
                response = requests.delete(f"{self.api_base_url}/delete_donation?id={donation_id}")
                
                if response.status_code == 200:
                    # רענון נתונים
                    self.load_data()
                    messagebox.showinfo("הצלחה", f"התורם {donor_name} נמחק בהצלחה")
                elif response.status_code == 404:
                    messagebox.showerror("שגיאה", "התורם לא נמצא במסד הנתונים")
                else:
                    error_data = response.json()
                    messagebox.showerror("שגיאה", f"שגיאה במחיקת תורם: {error_data.get('error', 'שגיאה לא ידועה')}")
                
            except Exception as e:
                messagebox.showerror("שגיאה", f"שגיאה במחיקת תורם: {str(e)}")

def main():
    root = tk.Tk()
    app = DonationManager(root)
    root.mainloop()

if __name__ == "__main__":
    main()
