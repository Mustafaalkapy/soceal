// إعداد Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('users');
    const userVerificationSection = document.getElementById('user-verification');
    const verifyUserForm = document.getElementById('verify-user-form');
    const userEmailInput = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout');

    const loadUsers = async () => {
        try {
            const usersSnapshot = await db.collection('users').get();
            userList.innerHTML = '';
            usersSnapshot.forEach(doc => {
                const user = doc.data();
                userList.innerHTML += `
                    <li>
                        <p>${user.email} ${user.verified ? '<span class="verified">توثيق</span>' : '<button class="verify-button" data-email="' + user.email + '">توثيق</button>'}</p>
                    </li>
                `;
            });

            // إضافة وظيفة توثيق المستخدمين
            document.querySelectorAll('.verify-button').forEach(button => {
                button.addEventListener('click', () => {
                    userEmailInput.value = button.getAttribute('data-email');
                    userVerificationSection.classList.remove('hidden');
                });
            });
        } catch (error) {
            alert('خطأ في تحميل المستخدمين: ' + error.message);
        }
    };

    verifyUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = userEmailInput.value;

        try {
            // التحقق من البريد الإلكتروني
            const usersSnapshot = await db.collection('users').where('email', '==', email).get();
            if (!usersSnapshot.empty) {
                const userDoc = usersSnapshot.docs[0];
                await db.collection('users').doc(userDoc.id).update({ verified: true });
                alert('تم توثيق المستخدم بنجاح');
                userVerificationSection.classList.add('hidden');
                loadUsers();
            } else {
                alert('لم يتم العثور على المستخدم');
            }
        } catch (error) {
            alert('خطأ في توثيق المستخدم: ' + error.message);
        }
    });

    logoutButton.addEventListener('click', async () => {
        try {
            await auth.signOut();
            window.location.href = 'login.html'; // إعادة توجيه إلى صفحة تسجيل الدخول
        } catch (error) {
            alert('خطأ في تسجيل الخروج: ' + error.message);
        }
    });

    // تحميل المستخدمين عند تحميل الصفحة
    loadUsers();
});