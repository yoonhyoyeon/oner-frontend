'use client';

import { useState } from 'react';
import styles from "./index.module.css";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

const SignIn = () => {
    const router = useRouter();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useUserStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/api/auth/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('로그인 성공:', data.data.role);
                login(data.data.access_token);
                if(data.data.role == 'student') {
                    console.log('student');
                    router.push('/student/courses');
                } else if(data.data.role == 'teacher') {
                    console.log('professor');
                    router.push('/professor/courses');
                }
            } else {
                const errorData = await response.json();
                console.error('로그인 실패:', errorData.message);
                alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
            }
        } catch (error) {
            console.error('로그인 에러:', error);
            alert('로그인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.formContainer}>
                    <h1 className={styles.mainTitle}>진짜 온라인 강의의 시작, </h1>
                    <h1 className={styles.title}>ONER를 시작하세요.</h1>
                    <p className={styles.subtitle}>로그인해 주세요</p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="id">아이디</label>
                            <input
                                id="id"
                                type="text"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder="아이디를 입력하세요"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password">비밀번호</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                        </div>

                        <button type="submit" className={styles.loginButton}>
                            로그인
                        </button>
                    </form>

                    <p className={styles.signupText}>
                        계정이 없으신가요? <Link href="/signup" className={styles.signupLink}>회원가입</Link>
                    </p>
                </div>
            </div>
                
            <div className={styles.logoContainer}>
                <img src="/images/logo/logo.png" alt="ONER Logo" className={styles.logo} />
            </div>
        </div>
    );
};

export default SignIn;