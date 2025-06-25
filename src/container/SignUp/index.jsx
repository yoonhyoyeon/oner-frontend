'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './index.module.css';
import { useRouter } from 'next/navigation';

const SignUp = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        studentId: '',
        major: '',
        school: '',
        role: 'student',
        password: '',
        passwordConfirm: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        // passwordConfirm을 제외한 데이터 전송
        const { passwordConfirm, ...requestData } = formData;

        const response = await fetch('/api/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            // 회원가입 성공 시 로그인 페이지로 이동
            alert('회원가입에 성공했습니다.');
            router.push('/signin');
        } else {
            const data = await response.json();
            console.log('data', data);
            console.log('formData', requestData);
            alert('회원가입에 실패했습니다.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.formContainer}>
                    <h1 className={styles.mainTitle}>진짜 온라인 강의의 시작, </h1>
                    <h1 className={styles.title}>ONER를 시작하세요.</h1>
                    <p className={styles.subtitle}>회원가입해 주세요</p>
                    
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <select
                            name="role"
                            className={styles.input}
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="student">학생</option>
                            <option value="teacher">교수</option>
                        </select>
                        <input
                            type="text"
                            name="id"
                            placeholder="아이디"
                            className={styles.input}
                            value={formData.id}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="name"
                            placeholder="이름"
                            className={styles.input}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="studentId"
                            placeholder="학번"
                            className={styles.input}
                            value={formData.studentId}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="major"
                            placeholder="전공"
                            className={styles.input}
                            value={formData.major}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="school"
                            placeholder="학교"
                            className={styles.input}
                            value={formData.school}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            className={styles.input}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="passwordConfirm"
                            placeholder="비밀번호 확인"
                            className={styles.input}
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            required
                        />
                        
                        <button type="submit" className={styles.button}>
                            회원가입
                        </button>
                        
                        <p className={styles.signupText}>
                            이미 계정이 있으신가요? <Link href="/signin" className={styles.signupLink}>로그인</Link>
                        </p>
                    </form>
                </div>
            </div>
            <div className={styles.logoContainer}>
                <Image
                    src="/images/logo/logo.png"
                    alt="Logo"
                    width={400}
                    height={100}
                    className={styles.logo}
                />
            </div>
        </div>
    );
};

export default SignUp;