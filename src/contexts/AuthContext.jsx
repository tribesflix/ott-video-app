import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export const AuthContext = createContext();

const AuthState = ({ children }) => {
    const [user, setUser] = useState(null);
    const [manualLog, setManualLog] = useState({ email: "", password: "" });
    const [createUser, setCreateUser] = useState({ name: "", email: "", password: "" });
    const [deviceId, setDeviceId] = useState(localStorage.getItem('deviceId') || uuidv4());
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('deviceId', deviceId);
    }, [deviceId]);

    const checkDeviceLimit = async (uid) => {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const devices = userData.devices || [];

            const deviceLimit = userData.subscription === "Free" 
            ? 1 
            : userData.subscription === "Standard" 
            ? 2 
            : userData.subscription === "Premium" 
            ? 3 
            : 3;

            if (devices.length >= deviceLimit && !devices.includes(deviceId)) {
                return false;
            }

            if (!devices.includes(deviceId)) {
                devices.push(deviceId);
                await updateDoc(doc(db, 'users', uid), { devices });
            }

            return true;
        }
        return false;
    };

    const handleGoogleSignup = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const uid = result.user.uid;
            const deviceAllowed = await checkDeviceLimit(uid);

            if (!deviceAllowed) {
                toast.error("You have reached the maximum number of devices.");
                return;
            }

            await setDoc(doc(db, 'users', uid), {
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL,
                type: "user",
                subscription: "Free",
                createdAt: serverTimestamp(),
                devices: [deviceId]
            }, { merge: true });

            setUser(result.user);
            navigate('/home');
        } catch (error) {
            console.error(error);
            toast.error("Signup Error: Error creating account.");
        }
    };

    const handleManualSignup = async (event) => {
        event.preventDefault();
        try {
            const result = await createUserWithEmailAndPassword(auth, createUser.email, createUser.password);
            const uid = result.user.uid;
            const deviceAllowed = await checkDeviceLimit(uid);

            if (!deviceAllowed) {
                toast.error("You have reached the maximum number of devices.");
                return;
            }

            const editUser = result.user;

            await updateProfile(editUser, {
                displayName: createUser.name,
                photoURL: "/images/signed.jpg"
            });

            await setDoc(doc(db, 'users', uid), {
                name: editUser.displayName,
                email: editUser.email,
                photo: editUser.photoURL,
                type: "user",
                subscription: "Free",
                createdAt: serverTimestamp(),
                devices: [deviceId]
            }, { merge: true });

            setUser(editUser);
            setCreateUser({ name: "", email: "", password: "" });
            navigate('/home');
        } catch (error) {
            console.error(error);
            toast.error("Signup Error: Error creating account.");
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const uid = result.user.uid;
            const deviceAllowed = await checkDeviceLimit(uid);

            if (!deviceAllowed) {
                toast.error("You have reached the maximum number of devices.");
                return;
            }

            navigate('/home');
        } catch (error) {
            console.error(error);
            toast.error("Login Error: Error logging in.");
        }
    };

    const handleManualLogin = async (event) => {
        event.preventDefault();
        try {
            const result = await signInWithEmailAndPassword(auth, manualLog.email, manualLog.password);
            const uid = result.user.uid;
            const deviceAllowed = await checkDeviceLimit(uid);

            if (!deviceAllowed) {
                toast.error("You have reached the maximum number of devices.");
                return;
            }

            setManualLog({ email: "", password: "" });
            navigate('/home');
        } catch (error) {
            console.error(error);
            toast.error("Login Error: Error logging in.");
        }
    };

    const handleSignOut = async () => {
        try {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const devices = userDoc.data().devices || [];
                    const updatedDevices = devices.filter(d => d !== deviceId);
                    await updateDoc(userDocRef, { devices: updatedDevices });
                }
            }
            await auth.signOut();
            setUser(null);
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const checkUser = await getDoc(doc(db, "users", user.uid));
                    if (checkUser.exists()) {
                        const userData = {
                            uid: user.uid,
                            ...checkUser.data()
                        }
                        setUser(userData);
                    } else {
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Error fetching user", error);
                }
            } else {
                setUser(null);
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, handleGoogleSignup, handleGoogleLogin, handleManualLogin, handleManualSignup, handleSignOut, manualLog, setManualLog, createUser, setCreateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthState;
