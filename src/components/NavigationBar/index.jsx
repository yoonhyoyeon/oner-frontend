'use client';

import styles from "./index.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import cx from "classnames";

const ProfessorNavigationBar = () => {
    const pathname = usePathname();

    if (pathname.startsWith("/professor/lecture")||pathname.startsWith("/professor/lectureinfo")) {
        return null;
    }
    
    return (
    <div className={styles.container}>
        <div className={styles.top}>
            <div className={styles.logo}>
                <img src="/images/logo/logo.png" alt="logo" width={100} />
            </div>
            <div className={styles.navItems}>
                <Link href="/professor/courses">
                    <div className={cx(styles.item, pathname === "/professor/courses" ? styles.active : null)}>
                        <img 
                            src={pathname === "/professor/courses" ? "/images/icons/book_active.png" : "/images/icons/book.png"} 
                            alt="dashboard" 
                            width={20} 
                        />
                        <span>강의 목록</span>
                    </div>
                </Link>
                <Link href="/professor/complain">
                    <div className={cx(styles.item, pathname === "/professor/complain" ? styles.active : null)}>
                        <img 
                            src={pathname === "/professor/complain" ? "/images/icons/book_active.png" : "/images/icons/book.png"} 
                            alt="dashboard" 
                            width={20} 
                        />
                        <span>이의신청 목록</span>
                    </div>
                </Link>
            </div>
        </div>
        <div className={styles.userInfo}>
            <div className={styles.userInfo__name}>
                <img src="/images/icons/user.png" alt="user" width={20} />
                <span>김교수</span>
            </div>
            <Link href="/student/logout">
                <img src="/images/icons/logout.png" alt="logout" width={20} />
            </Link>
        </div>
    </div>
  );
}

const StudentNavigationBar = () => {
    const pathname = usePathname();
    if (pathname.startsWith("/student/lecture")) {
        return null;
    }
    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <div className={styles.logo}>
                    <img src="/images/logo/logo.png" alt="logo" width={100} />
                </div>
                <div className={styles.navItems}>
                    <Link href="/student/courses">
                        <div className={cx(styles.item, pathname === "/student/courses" ? styles.active : null)}>
                            <img 
                                src={pathname === "/student/courses" ? "/images/icons/book_active.png" : "/images/icons/book.png"} 
                                alt="dashboard" 
                                width={20} 
                            />
                            <span>강의 목록</span>
                        </div>
                    </Link>
                    <Link href="/student/check">
                        <div className={cx(styles.item, pathname === "/student/check" ? styles.active : null)}>
                            <img 
                                src={pathname === "/student/check" ? "/images/icons/check_active.png" : "/images/icons/check.png"} 
                                alt="dashboard" 
                                width={20} 
                            />
                            <span>출결 현황</span>
                        </div>
                    </Link>
                    <Link href="/student/phone">
                        <div className={cx(styles.item, pathname === "/student/phone" ? styles.active : null)}>
                            <img 
                                src={pathname === "/student/phone" ? "/images/icons/phone_active.png" : "/images/icons/phone.png"} 
                                alt="phone" 
                                width={20} 
                            />
                            <span>휴대폰 변경 신청</span>
                        </div>
                    </Link>
                </div>
            </div>
            
            <div className={styles.userInfo}>
                <div className={styles.name_container}>
                    <img src="/images/icons/user.png" alt="user" width={20} />
                    <span>김학생</span>
                </div>
                <Link href="/student/logout">
                    <img src="/images/icons/logout.png" alt="logout" width={20} />
                </Link>
            </div>
        </div>
    );
}

export { ProfessorNavigationBar, StudentNavigationBar };