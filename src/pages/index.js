import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

export default function Home() {
  const [isAiMode, setIsAiMode] = useState(false);
  const [dateTimeInfo, setDateTimeInfo] = useState('');
  const { siteConfig } = useDocusaurusContext();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Установка московского времени (UTC+3)
      const mskTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));

      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];

      const seasons = {
        0: 'Зима', 1: 'Зима', 2: 'Весна',
        3: 'Весна', 4: 'Весна', 5: 'Лето',
        6: 'Лето', 7: 'Лето', 8: 'Осень',
        9: 'Осень', 10: 'Осень', 11: 'Зима'
      };

      const date = mskTime.getDate();
      const month = months[mskTime.getMonth()];
      const year = mskTime.getFullYear();
      const season = seasons[mskTime.getMonth()];
      const hours = mskTime.getHours().toString().padStart(2, '0');
      const minutes = mskTime.getMinutes().toString().padStart(2, '0');

      const formatted = `На дворе ${date} ${month} ${year} год. Сезон ${season}. ${hours}:${minutes} МСК`;
      setDateTimeInfo(formatted);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 60000); // Обновляем каждую минуту

    return () => clearInterval(timer);
  }, []);

  const skills = {
    frontend: [
      { name: 'HTML5' },
      { name: 'CSS3' },
      { name: 'Bootstrap' },
      { name: 'JavaScript' },
      { name: 'jQuery' },
      { name: 'React.js' },
      { name: 'Tailwind CSS' },
    ],
    backend: [
      { name: 'PHP' },
      { name: 'MySQL' },
      { name: 'WordPress' },
      { name: 'Next.js' },
    ],
    os: [
      { name: 'Windows' },
      { name: 'macOS' },
      { name: 'Debian' },
      { name: 'Ubuntu' },
    ],
    tools: [
      { name: 'Git' },
      { name: 'VS Code' },
      { name: 'PhpStorm' },
    ]
  };

  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Portfolio of a WordPress and Frontend Developer"
    >
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.timeStamp}>
            <span>{dateTimeInfo}</span>
            <div>
              <Link
                className="button button--secondary button--lg"
                to="/blog">
                Мои Записи
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/docs/intro">
                Доки
              </Link>
            </div>
          </div>

          <div className={styles.photoContainer}>
            <img
              src={isAiMode ? "/img/real-photo.jpg" : "/img/ai-photo.jpg"}
              alt={isAiMode ? "Реальное фото" : "AI версия фото"}
              className={styles.photo}
            />
            <button
              onClick={() => setIsAiMode(!isAiMode)}
              className={clsx(styles.toggleButton, {
                [styles.aiMode]: isAiMode
              })}
              aria-label="Переключатель Фото"
            >
              <div className={styles.toggleKnob}>
                {isAiMode ? '👤' : '🤖'}
              </div>
              <span className={styles.toggleLabel}>
                {isAiMode ? 'Реальное фото' : 'AI версия'}
              </span>
            </button>
          </div>

          <div className={styles.introduction}>
            <h1>Я — Full Stack WordPress Developer.</h1>
            <p className={styles.bio}>
              Специализируюсь на разработке современных веб-приложений на WordPress и Next.js. SEO и быстрые старты на базе готовых решений.
              <br />
              Хотите обсудить ваш проект? &nbsp;
              <a href="mailto:&#51;&#56;&#48;&#56;&#57;&#50;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;">
                Напишите мне на почту
              </a>.
            </p>
          </div>

          <div className={styles.skillsSection}>
            <div className={styles.skillCategory}>
              <h3>Frontend</h3>
              <div className={styles.badges}>
                {skills.frontend.map((skill) => (
                  <span
                    key={skill.name}
                    className={styles.badge}
                    role="listitem"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.skillCategory}>
              <h3>Backend</h3>
              <div className={styles.badges}>
                {skills.backend.map((skill) => (
                  <span
                    key={skill.name}
                    className={styles.badge}
                    role="listitem"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.skillCategory}>
              <h3>Операционные системы</h3>
              <div className={styles.badges}>
                {skills.os.map((skill) => (
                  <span
                    key={skill.name}
                    className={styles.badge}
                    role="listitem"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.skillCategory}>
              <h3>Инструменты</h3>
              <div className={styles.badges}>
                {skills.tools.map((skill) => (
                  <span
                    key={skill.name}
                    className={styles.badge}
                    role="listitem"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}