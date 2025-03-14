import { addDoc, collection, onSnapshot, serverTimestamp, query, where, orderBy } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useEffect, useState } from "react";
import Message from "../components/Message";

const Chat = ({ room, setRoom }) => {

    // güncelleyeceğimiz koleksiyonun referansını alma
    const messagesCol = collection(db, "messages");
    const [messages, setMessages] = useState([]);

    // mesajı veritabanına ekler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target[0].value;

        // add doc yeni doküman ekler (auto id)
        // add doc iki parametre ister
        // - ekleme yapacağımız koleksiyonun referansı
        // - data
        await addDoc(messagesCol, {
            text,
            room,
            user: {
                name: auth.currentUser.displayName,
                photo: auth.currentUser.photoURL,
                uid: auth.currentUser.uid
            },
            // server'ın zamanı oluşturmasını sağlar
            createdAt: serverTimestamp(),
        });
    };

    useEffect(() => {
        if (!room) return;

        // filtreleme ayarlarını tanımlama
        const queryOptions = query(
            messagesCol,
            where("room", "==", room),
            orderBy("createdAt", "asc")
        );

        // on snapshot: koleksiyon her değiştiğinde
        // bir fonksiyon çalıştırıp, fonksiyona güncel
        // dokümanları parametre olarak gönderir
        const unsubscribe = onSnapshot(queryOptions, (snapshot) => {
            let tempMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            // state'i güncelleme
            setMessages(tempMessages);
        });
        
        // Oda değiştiğinde eski mesajları kaldır
        return () => unsubscribe();   
    }, [room]);

    return (
        <div className="chat">
            <header>
                <p className="user">{auth?.currentUser?.displayName}</p>
                <p>{room}</p>
                <button onClick={() => setRoom(null)}>Farklı Oda</button>
            </header>

            <main>
                {messages?.map((msg) => ( 
                <Message key={msg.id} msg={msg} /> 
                ))}
            </main>

            <form onSubmit={handleSubmit}>
                <input required type="text" placeholder="mesajınızı yazınız..." />
                <button>Gönder</button>
            </form>
        </div>
    );
};

export default Chat;