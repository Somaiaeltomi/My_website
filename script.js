// ==========================================
// دوال عامة للموقع
// ==========================================

// دالة للتحقق من صحة النماذج الأساسية
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            markFieldAsInvalid(input);
        } else {
            markFieldAsValid(input);
        }
    });
    
    return isValid;
}

// دالة لعرض رسائل للمستخدم
function showMessage(message, type = 'success') {
    // إزالة أي رسائل سابقة
    const existingMessage = document.querySelector('.message-alert');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-alert';
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        border-radius: 4px;
        color: white;
        text-align: center;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        min-width: 300px;
        max-width: 90%;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = '#27ae60';
    } else if (type === 'error') {
        messageDiv.style.background = '#e74c3c';
    } else if (type === 'warning') {
        messageDiv.style.background = '#f39c12';
    } else if (type === 'info') {
        messageDiv.style.background = '#3498db';
    }
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // إزالة الرسالة بعد 5 ثواني
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// دالة لتحديد الحقل غير صالح
function markFieldAsInvalid(field) {
    field.style.borderColor = '#e74c3c';
    field.style.backgroundColor = '#fdf2f2';
    
    // إضافة رسالة خطأ إذا لم تكن موجودة
    let errorMessage = field.parentNode.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('small');
        errorMessage.className = 'error-message';
        errorMessage.style.cssText = 'color: #e74c3c; display: block; margin-top: 0.25rem; font-size: 0.875rem;';
        errorMessage.textContent = 'هذا الحقل مطلوب';
        field.parentNode.appendChild(errorMessage);
    }
}

// دالة لإزالة تظليل الخطأ
function markFieldAsValid(field) {
    field.style.borderColor = '#ddd';
    field.style.backgroundColor = '';
    
    // إزالة رسالة الخطأ إذا كانت موجودة
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// ==========================================
// دوال التحقق من صحة البيانات
// ==========================================

// دالة للتحقق من صحة البريد الإلكتروني
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// دالة للتحقق من صحة رقم الهاتف السعودي
function validateSaudiPhone(phone) {
    const phoneRegex = /^(05)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
    return phoneRegex.test(phone);
}

// دالة للتحقق من صحة رقم الهوية
function validateNationalId(id) {
    const idRegex = /^[0-9]{10,15}$/;
    return idRegex.test(id);
}

// دالة للتحقق من تاريخ الميلاد (أن يكون عمره 16 سنة على الأقل)
function validateBirthDate(dateString) {
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 16;
    }
    return age >= 16;
}

// ==========================================
// دوال خاصة بصفحة تسجيل المتطوع
// ==========================================

function setupVolunteerForm() {
    const form = document.getElementById('volunteerForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // التحقق من الحقول المطلوبة الأساسية
        if (!validateForm(this)) {
            showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        // تحقق إضافي من البريد الإلكتروني
        const email = document.getElementById('email');
        if (email && !validateEmail(email.value)) {
            showMessage('يرجى إدخال بريد إلكتروني صحيح', 'error');
            markFieldAsInvalid(email);
            return;
        } else if (email) {
            markFieldAsValid(email);
        }

        // تحقق إضافي من رقم الهاتف
        const phone = document.getElementById('phone');
        if (phone && !validateSaudiPhone(phone.value)) {
            showMessage('يرجى إدخال رقم هاتف سعودي صحيح (05xxxxxxxx)', 'error');
            markFieldAsInvalid(phone);
            return;
        } else if (phone) {
            markFieldAsValid(phone);
        }

        // تحقق إضافي من رقم الهوية
        const nationalId = document.getElementById('nationalId');
        if (nationalId && !validateNationalId(nationalId.value)) {
            showMessage('يرجى إدخال رقم هوية صحيح (10-15 رقم)', 'error');
            markFieldAsInvalid(nationalId);
            return;
        } else if (nationalId) {
            markFieldAsValid(nationalId);
        }

        // تحقق من تاريخ الميلاد
        const birthDate = document.getElementById('birthDate');
        if (birthDate && !validateBirthDate(birthDate.value)) {
            showMessage('يجب أن يكون عمر المتطوع 16 سنة على الأقل', 'error');
            markFieldAsInvalid(birthDate);
            return;
        } else if (birthDate) {
            markFieldAsValid(birthDate);
        }

        // التحقق من اختيار مجال اهتمام واحد على الأقل
        const interests = form.querySelectorAll('input[name="interests"]:checked');
        if (interests.length === 0) {
            showMessage('يرجى اختيار مجال اهتمام واحد على الأقل', 'error');
            return;
        }

        // إذا وصلنا هنا، كل شيء صحيح
        showMessage('تم تسجيل المتطوع بنجاح! سيتم التواصل معك قريباً.', 'success');
        
        // إعادة تعيين النموذج بعد 2 ثانية
        setTimeout(() => {
            form.reset();
            // إزالة أي تظليل باقي
            const allInputs = form.querySelectorAll('input, select, textarea');
            allInputs.forEach(input => markFieldAsValid(input));
        }, 2000);
    });

    // إضافة تحقق فوري للحقول
    const immediateValidationFields = form.querySelectorAll('#email, #phone, #nationalId, #birthDate');
    immediateValidationFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value.trim()) {
                let isValid = true;
                
                if (this.id === 'email' && !validateEmail(this.value)) {
                    isValid = false;
                    showMessage('بريد إلكتروني غير صحيح', 'warning');
                } else if (this.id === 'phone' && !validateSaudiPhone(this.value)) {
                    isValid = false;
                    showMessage('رقم هاتف غير صحيح', 'warning');
                } else if (this.id === 'nationalId' && !validateNationalId(this.value)) {
                    isValid = false;
                    showMessage('رقم هوية غير صحيح', 'warning');
                } else if (this.id === 'birthDate' && !validateBirthDate(this.value)) {
                    isValid = false;
                    showMessage('يجب أن يكون عمرك 16 سنة على الأقل', 'warning');
                }
                
                if (isValid) {
                    markFieldAsValid(this);
                } else {
                    markFieldAsInvalid(this);
                }
            }
        });
    });
}

// ==========================================
// دوال خاصة بصفحة البحث
// ==========================================

function setupSearchForm() {
    const form = document.getElementById('searchForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const searchTerm = document.getElementById('searchTerm')?.value;
        const category = document.getElementById('category')?.value;
        const city = document.getElementById('city')?.value;
        
        if (!searchTerm && !category && !city) {
            showMessage('يرجى إدخال معايير البحث على الأقل', 'warning');
            return;
        }
        
        // محاكاة نتائج البحث
        showMessage(`جارٍ البحث عن: ${searchTerm || 'جميع الفرص'} في ${city || 'جميع المدن'}`, 'info');
        
        // هنا يمكن إضافة كود AJAX لجلب النتائج الحقيقية
        setTimeout(() => {
            showMessage('تم العثور على 15 فرصة تطوع تطابق معايير البحث', 'success');
        }, 1500);
    });
}

// ==========================================
// دوال خاصة بالحاسبة
// ==========================================

function setupCalculator() {
    const form = document.getElementById('calculatorForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const hours = parseInt(document.getElementById('totalHours').value) || 0;
        
        if (hours <= 0) {
            showMessage('يرجى إدخال عدد ساعات صحيح', 'error');
            return;
        }
        
        let level = '';
        let message = '';
        
        if (hours >= 200) {
            level = 'خبير';
            message = 'مستوى متميز! أنت خبير في العمل التطوعي 🏆';
        } else if (hours >= 100) {
            level = 'متقدم';
            message = 'مستوى رائع! لديك خبرة كبيرة في التطوع ⭐';
        } else if (hours >= 50) {
            level = 'متوسط';
            message = 'مستوى جيد! استمر في العطاء 🌟';
        } else if (hours >= 10) {
            level = 'مبتدئ';
            message = 'مستوى مبتدئ! أنت في بداية رحلة العطاء 🌱';
        } else {
            level = 'جديد';
            message = 'ابدأ رحلتك التطوعية الآن! 🚀';
        }
        
        const resultDiv = document.getElementById('calculatorResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                           color: white; padding: 2rem; border-radius: 8px; text-align: center;">
                    <h3>نتيجة التقييم</h3>
                    <div style="font-size: 3rem; margin: 1rem 0;">${level}</div>
                    <p>${message}</p>
                    <div style="margin-top: 1rem;">
                        <strong>عدد الساعات:</strong> ${hours} ساعة
                    </div>
                </div>
            `;
        }
        
        showMessage('تم حساب مستوى التطوع بنجاح', 'success');
    });
}

// ==========================================
// دوال التنصيب العام
// ==========================================

// دالة لتهيئة جميع النماذج في الموقع
function initializeAllForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        // إزالة الـ listener القديم إذا كان موجوداً
        form.removeEventListener('submit', handleFormSubmit);
        // إضافة الـ listener جديد
        form.addEventListener('submit', handleFormSubmit);
    });
}

// دالة معالجة إرسال النماذج العامة
function handleFormSubmit(e) {
    if (!validateForm(this)) {
        e.preventDefault();
        showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
    }
}

// دالة لتهيئة تأثيرات الصفحة
function initializePageEffects() {
    // تأثيرات للزر عند المرور
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // تأثيرات لحقول الإدخال
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#3498db';
            this.style.boxShadow = '0 0 0 2px rgba(52, 152, 219, 0.2)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '#ddd';
            this.style.boxShadow = 'none';
        });
    });
}

// ==========================================
// التهيئة عند تحميل الصفحة
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('تم تحميل الموقع بنجاح! 🌟');
    
    // تهيئة النماذج العامة
    initializeAllForms();
    
    // تهيئة النماذج الخاصة
    setupVolunteerForm();
    setupSearchForm();
    setupCalculator();
    
    // تهيئة التأثيرات
    initializePageEffects();
    
    // إظهار رسالة ترحيب
    setTimeout(() => {
        showMessage('مرحباً بك في بنك العطاء! 🌸', 'info');
    }, 1000);
});

// ==========================================
// دوال مساعدة إضافية
// ==========================================

// دالة لتنسيق الأرقام
function formatNumber(number) {
    return new Intl.NumberFormat('ar-SA').format(number);
}

// دالة لحساب الفرق بين التواريخ
function calculateDateDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const difference = end.getTime() - start.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24)); // الفرق بالأيام
}

// دالة للتحقق من حجم الملف
function validateFileSize(fileInput, maxSizeMB) {
    if (fileInput.files.length > 0) {
        const fileSize = fileInput.files[0].size / 1024 / 1024; // الحجم بالميجابايت
        return fileSize <= maxSizeMB;
    }
    return true;
}
function saveAsDraft() {
    showMessage('تم حفظ فرصة التطوع كمسودة بنجاح!', 'info');
}

function publishOpportunity() {
    const form = document.getElementById('opportunityForm');
    if (validateForm(form)) {
        showMessage('تم نشر فرصة التطوع بنجاح!', 'success');
        // هنا يمكن إضافة كود لإرسال البيانات إلى الخادم
    } else {
        showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
    }
}

// نضيف هذه الدوال في ملف script.js

// دالة تسجيل الساعات
// دالة تسجيل الساعات - مع تصحيح الأخطاء
function registerHours() {
    // الحقول الأساسية المطلوبة فقط
    const requiredFields = [
        'volunteerSelect',
        'opportunitySelect', 
        'workDate',
        'totalHours',
        'workDescription'
    ];
    
    let hasError = false;
    
    // تحقق بسيط جداً
    for (let i = 0; i < requiredFields.length; i++) {
        const field = document.getElementById(requiredFields[i]);
        if (field && !field.value) {
            hasError = true;
            break; // نتوقف عند أول خطأ
        }
    }
    
    if (hasError) {
        showMessage('⚠️ يرجى ملء الحقول المطلوبة', 'error');
    } else {
        showMessage('✅ تم التسجيل بنجاح!', 'success');
        setTimeout(() => {
            document.getElementById('hoursForm').reset();
        }, 2000);
    }
}
// دالة حفظ وحساب الساعات
function saveAndCalculateHours() {
    const totalHours = document.getElementById('totalHours')?.value;
    
    if (totalHours && totalHours > 0) {
        showMessage(`💾 تم الحفظ بنجاح! المجموع: ${totalHours} ساعة تطوعية`, 'info');
        
        // حفظ في localStorage (ميزة إضافية)
        const formData = new FormData(document.getElementById('hoursForm'));
        localStorage.setItem('savedHours', JSON.stringify(Object.fromEntries(formData)));
    } else {
        showMessage('📊 يرجى إدخال عدد الساعات أولاً', 'warning');
    }
}
function performSearch() {
    const searchTerm = document.getElementById('searchKeyword').value;
    const category = document.getElementById('searchCategory').value;
    
    // إذا لم يتم إدخال أي شيء، نعرض رسالة تنبيه
    if (!searchTerm && !category) {
        showMessage('🔍 يرجى إدخال كلمة البحث أو اختيار تصنيف', 'warning');
        return;
    }
    
    // رسالة أن البحث جاري
    showMessage('🔎 جاري البحث عن فرص التطوع...', 'info');
    
    // محاكاة البحث بعد فترة قصيرة
    setTimeout(() => {
        showMessage('✅ تم العثور على 5 فرص تطوع', 'success');
    }, 1500);
}
function calculateLevel() {
    const totalHours = document.getElementById('totalHours').value;
    
    if (!totalHours || totalHours <= 0) {
        showMessage('⚠️ يرجى إدخال عدد الساعات', 'error');
        return;
    }
    
    const hours = parseInt(totalHours);
    let level = '';
    let explanation = '';
    
    // حساب المستوى مع الشرح
    if (hours >= 500) {
        level = 'محترف ⭐⭐⭐⭐⭐';
        explanation = '500+ ساعة - أنت قائد في العمل التطوعي!';
    } else if (hours >= 300) {
        level = 'خبير ⭐⭐⭐⭐';
        explanation = '300-499 ساعة - لديك خبرة متميزة';
    } else if (hours >= 150) {
        level = 'متقدم ⭐⭐⭐';
        explanation = '150-299 ساعة - مستوى متقدم في التطوع';
    } else if (hours >= 50) {
        level = 'متوسط ⭐⭐';
        explanation = '50-149 ساعة - لديك خبرة جيدة';
    } else {
        level = 'مبتدئ ⭐';
        explanation = '1-49 ساعة - بداية رحلة التطوع';
    }
    
    // عرض النتيجة مع الشرح
    const resultDiv = document.getElementById('calculatorResult');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 8px; text-align: center;">
                <h3>نتيجة التقييم</h3>
                <div style="font-size: 2.5rem; margin: 1rem 0;">${level}</div>
                <p>${explanation}</p>
                <div style="margin-top: 1rem; background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px;">
                    <strong>عدد الساعات:</strong> ${hours} ساعة
                </div>
            </div>
        `;
    }
    
    showMessage(`✅ تم حساب المستوى: ${level}`, 'success');
}


function saveResults() {
    const totalHours = document.getElementById('totalHours').value;
    
    if (!totalHours || totalHours <= 0) {
        showMessage('⚠️ لا توجد نتائج لحفظها', 'warning');
        return;
    }
    
    showMessage('💾 تم حفظ النتائج بنجاح!', 'success');
}