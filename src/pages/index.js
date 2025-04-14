import React, { useState } from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import clsx from 'clsx';

export default function Home() {
  const [isAiMode, setIsAiMode] = useState(false);

  return (
    <Layout>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.photoContainer}>
            <img
              src={isAiMode ? "/img/ai-photo.jpg" : "/img/real-photo.jpg"}
              alt={isAiMode ? "AI версия" : "Реальное фото"}
              className={styles.photo}
            />
            <button
              onClick={() => setIsAiMode(!isAiMode)}
              className={clsx(styles.toggleButton, {
                [styles.aiMode]: isAiMode
              })}
            >
              <div className={styles.toggleKnob}>
                {isAiMode ? '🤖' : '👤'}
              </div>
              <span className={styles.toggleLabel}>
                {isAiMode ? 'AI версия' : 'Реальное фото'}
              </span>
            </button>
          </div>
          <h1>Добро пожаловать!</h1>
          <p>
            Я занимаюсь веб-разработкой.
          </p>
        </div>
      </main>
    </Layout>
  );
}