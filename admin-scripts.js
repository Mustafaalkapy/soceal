// إعداد Firebase
const firebaseConfig = {
    apiKey: 1:612535081980:android:899f231d67fce6d2ba3079o",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "cubesok-2770c-default-rtdb.firebaseio.com",
    storageBucket: "cubesok-2770c.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "AIzaSyCwEm--ajwW9sZSXCJZ0bMLzDPOjaGjNgM"
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
