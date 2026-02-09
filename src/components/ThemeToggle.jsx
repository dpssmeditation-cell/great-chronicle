import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const themes = [
        { id: 'dark', icon: '🌙', label: 'Dark' },
        { id: 'light', icon: '☀️', label: 'Light' },
        { id: 'sepia', icon: '📜', label: 'Sepia' }
    ];

    return (
        <div className="theme-toggle" style={{ display: 'flex', gap: '0.5rem', background: 'var(--color-bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-full)' }}>
            {themes.map(t => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    title={t.label}
                    style={{
                        background: theme === t.id ? 'var(--color-bg-secondary)' : 'transparent',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all var(--transition-fast)',
                        boxShadow: theme === t.id ? 'var(--shadow-sm)' : 'none',
                        color: theme === t.id ? 'var(--color-text-primary)' : 'var(--color-text-muted)'
                    }}
                >
                    {t.icon}
                </button>
            ))}
        </div>
    );
}
