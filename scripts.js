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
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const profileSection = document.getElementById('profile-section');
    const storiesSection = document.getElementById('stories-section');
    const messagesSection = document.getElementById('messages-section');
    const userNameSpan = document.getElementById('user-name');
    const storiesList = document.getElementById('stories-list');
    const messagesList = document.getElementById('messages-list');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await auth.signInWithEmailAndPassword(email, password);
            loginSection.classList.add('hidden');
            profileSection.classList.remove('hidden');
            storiesSection.classList.remove('hidden');
            messagesSection.classList.remove('hidden');
            const user = auth.currentUser;
            userNameSpan.textContent = user.email;

            // تحميل القصص من Firestore
            const storiesSnapshot = await db.collection('stories').get();
            storiesList.innerHTML = '';
            storiesSnapshot.forEach(doc => {
                const story = doc.data();
                storiesList.innerHTML += `
                    <div class="story">
                        <p>${story.content}</p>
                    </div>
                `;
            });

            // تحميل الرسائل من Firestore
            const messagesSnapshot = await db.collection('messages').get();
            messagesList.innerHTML = '';
            messagesSnapshot.forEach(doc => {
                const message = doc.data();
                messagesList.innerHTML += `
                    <div class="message">
                        <p>${message.content}</p>
                    </div>
                `;
            });

        } catch (error) {
            alert('خطأ في تسجيل الدخول: ' + error.message);
        }
    });

    document.getElementById('add-story-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const storyContent = document.getElementById('story-content').value;

        try {
            await db.collection('stories').add({ content: storyContent });
            document.getElementById('story-content').value = '';
            // إعادة تحميل القصص
            const storiesSnapshot = await db.collection('stories').get();
            storiesList.innerHTML = '';
            storiesSnapshot.forEach(doc => {
                const story = doc.data();
                storiesList.innerHTML += `
                    <div class="story">
                        <p>${story.content}</p>
                    </div>
                `;
            });
        } catch (error) {
            alert('خطأ في إضافة القصة: ' + error.message);
        }
    });

    document.getElementById('message-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const messageContent = document.getElementById('message').value;

        try {
            await db.collection('messages').add({ content: messageContent });
            document.getElementById('message').value = '';
            // إعادة تحميل الرسائل
            const messagesSnapshot = await db.collection('messages').get();
            messagesList.innerHTML = '';
            messagesSnapshot.forEach(doc => {
                const message = doc.data();
                messagesList.innerHTML += `
                    <div class="message">
                        <p>${message.content}</p>
                    </div>
                `;
            });
        } catch (error) {
            alert('خطأ في إرسال الرسالة: ' + error.message);
        }
    });

    document.getElementById('logout').addEventListener('click', async () => {
        try {
            await auth.signOut();
            loginSection.classList.remove('hidden');
            profileSection.classList.add('hidden');
            storiesSection.classList.add('hidden');
            messagesSection.classList.add('hidden');
        } catch (error) {
            alert('خطأ في تسجيل الخروج: ' + error.message);
        }
    });
});