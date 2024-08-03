import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { createContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { useEffect } from 'react';

export const AuthContext = createContext();

const AuthState = ({ children }) => {

    const [user, setUser] = useState(null);

    const [manualLog, setManualLog] = useState({ email: "", password: "" });

    const [createUser, setCreateUser] = useState({ name: "", email: "", password: "" });

    const navigate = useNavigate();

    const handleGoogleSignup = async () => {
          const provider = new GoogleAuthProvider();
          try {
            const result = await signInWithPopup(auth, provider);
            const checkExistingUser = await getDoc(doc(db, 'users', result.user.uid));
    
            if(checkExistingUser.exists()) {
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-[black] w-[350px] px-4 py-2 border border-allotrix-std rounded-md`}>
                        <h3 className='font-bold font-allotrix-font-secondary text-allotrix-text text-lg'>
                            Signup Error!
                        </h3>
                        <p className='font-allotrix-font-secondary text-[gray] text-sm mt-1'>
                            This account already exists
                        </p>
                    </div>
                ));
                return;
            }

            await setDoc(doc(db, 'users', result.user.uid), {
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL,
                type: "user",
                createdAt: serverTimestamp()
            });

            setUser(result.user);
            navigate('/home');
    
          } catch (error) {
              console.error(error);
              toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-[black] w-[350px] px-4 py-2 border border-allotrix-std rounded-md`}>
                    <h3 className='font-bold font-allotrix-font-secondary text-allotrix-text text-lg'>
                        Signup Error!
                    </h3>
                    <p className='font-allotrix-font-secondary text-[gray] text-sm mt-1'>
                        Error creating account.
                    </p>
                </div>
            ));
        }
    }

    const handleManualSignup = async (event) => {
        event.preventDefault();
        try {
            const checkExistingUser = await getDoc(doc(collection(db, "users"), createUser.email));
        
            if(checkExistingUser.exists()) {
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-[black] w-[350px] px-4 py-2 border border-allotrix-std rounded-md`}>
                        <h3 className='font-bold font-allotrix-font-secondary text-allotrix-text text-lg'>
                            Signup Error!
                        </h3>
                        <p className='font-allotrix-font-secondary text-[gray] text-sm mt-1'>
                            This account already exists.
                        </p>
                    </div>
                ));
                return;
            }

            const result = await createUserWithEmailAndPassword(auth, createUser.email, createUser.password);
            const editUser = result.user;

            await updateProfile(editUser, {
                displayName: createUser.name,
                photoURL: "/images/signed.jpg"
            });

            await setDoc(doc(db, 'users', result.user.uid), {
                name: editUser.displayName,
                email: editUser.email,
                photo: editUser.photoURL,
                type: "user",
                createdAt: serverTimestamp()
            });

            setUser(editUser);
            setCreateUser({ name: "", email: "", password: "" });
            navigate('/home');
        } catch(error) {
            console.error(error);
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-[black] w-[350px] px-4 py-2 border border-allotrix-std rounded-md`}>
                    <h3 className='font-bold font-allotrix-font-secondary text-allotrix-text text-lg'>
                        Signup Error!
                    </h3>
                    <p className='font-allotrix-font-secondary text-[gray] text-sm mt-1'>
                        Error creating account.
                    </p>
                </div>
            ));
        }
    }

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const checkExistingUser = await getDoc(doc(db, 'users', result.user.uid));

            if(checkExistingUser.exists()) {
                navigate('/home');
            } else {
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-[black] w-[350px] px-4 py-2 border border-allotrix-std rounded-md`}>
                        <h3 className='font-bold font-allotrix-font-secondary text-allotrix-text text-lg'>
                            Login Error!
                        </h3>
                        <p className='font-allotrix-font-secondary text-[gray] text-sm mt-1'>
                            This account does not exist.
                        </p>
                    </div>
                ));
            }
            
        } catch (error) {
            console.error(error);
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-[black] w-[350px] px-4 py-2 border border-allotrix-std rounded-md`}>
                    <h3 className='font-bold font-allotrix-font-secondary text-allotrix-text text-lg'>
                        Login Error!
                    </h3>
                    <p className='font-allotrix-font-secondary text-[gray] text-sm mt-1'>
                        Error logging in.
                    </p>
                </div>
            ));
        }
    }

    const handleManualLogin = async (event) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, manualLog.email, manualLog.password);
            setManualLog({ email: "", password: "" });
            navigate('/home');
        } catch (error) {
            console.error(error);
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-[black] w-[350px] px-4 py-2 border border-allotrix-std rounded-md`}>
                    <h3 className='font-bold font-allotrix-font-secondary text-allotrix-text text-lg'>
                        Login Error!
                    </h3>
                    <p className='font-allotrix-font-secondary text-[gray] text-sm mt-1'>
                        Error logging in.
                    </p>
                </div>
            ));
        }
    }

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            setUser(null);
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if(user) {
                try {
                    const checkUser = await getDoc(doc(db, "users", user.uid));
                    if(checkUser.exists()) {
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
