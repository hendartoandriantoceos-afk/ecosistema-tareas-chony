import { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "salud", label: "Salud / Bienestar", color: "#10B981", bg: "#d1fae5", icon: "🏃" },
  { id: "instagram", label: "Instagram / Redes", color: "#E1306C", bg: "#fce4ec", icon: "📸" },
  { id: "academia", label: "Academia Digital", color: "#7C3AED", bg: "#ede9fe", icon: "🎓" },
  { id: "clientes", label: "Clientes / IA", color: "#0EA5E9", bg: "#e0f2fe", icon: "🤖" },
  { id: "email", label: "Email / WhatsApp", color: "#16A34A", bg: "#dcfce7", icon: "💬" },
  { id: "contenido", label: "Contenido", color: "#F59E0B", bg: "#fef3c7", icon: "✍️" },
  { id: "admin", label: "Admin / Finanzas", color: "#64748B", bg: "#f1f5f9", icon: "💼" },
];

const PRIORITIES = [
  { id: "urgente", label: "Urgente", color: "#EF4444", dot: "🔴" },
  { id: "importante", label: "Importante", color: "#F59E0B", dot: "🟡" },
  { id: "rutina", label: "Rutina", color: "#6B7280", dot: "⚪" },
];

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const SAMPLE_TASKS = [
  { id: 1, title: "Publicar Reels en Instagram", date: getWeekDates(0)[0].toISOString().split('T')[0], category: "instagram", priority: "importante", fixed: true, done: false, notes: "" },
  { id: 2, title: "Responder comentarios IG", date: getWeekDates(0)[0].toISOString().split('T')[0], category: "instagram", priority: "rutina", fixed: true, done: false, notes: "" },
  { id: 3, title: "Ejercicio matutino", date: getWeekDates(0)[0].toISOString().split('T')[0], category: "salud", priority: "importante", fixed: true, done: false, notes: "30 min cardio + estiramientos" },
  { id: 4, title: "Revisar alumnos Academia", date: getWeekDates(0)[1].toISOString().split('T')[0], category: "academia", priority: "importante", fixed: true, done: false, notes: "" },
  { id: 5, title: "Reunión con cliente IA", date: getWeekDates(0)[1].toISOString().split('T')[0], category: "clientes", priority: "urgente", fixed: false, done: false, notes: "Preparar propuesta de implementación" },
  { id: 6, title: "Newsletter semanal", date: getWeekDates(0)[2].toISOString().split('T')[0], category: "email", priority: "importante", fixed: true, done: false, notes: "" },
  { id: 7, title: "Crear contenido para la semana", date: getWeekDates(0)[2].toISOString().split('T')[0], category: "contenido", priority: "urgente", fixed: true, done: false, notes: "" },
  { id: 8, title: "Yoga y meditación", date: getWeekDates(0)[2].toISOString().split('T')[0], category: "salud", priority: "rutina", fixed: true, done: false, notes: "45 min sesión de yoga + 10 min meditación" },
  { id: 9, title: "Revisión métricas IG", date: getWeekDates(0)[3].toISOString().split('T')[0], category: "instagram", priority: "rutina", fixed: true, done: false, notes: "" },
  { id: 10, title: "Actualizar módulo Academia", date: getWeekDates(0)[3].toISOString().split('T')[0], category: "academia", priority: "importante", fixed: false, done: false, notes: "" },
  { id: 11, title: "Facturación mensual", date: getWeekDates(0)[4].toISOString().split('T')[0], category: "admin", priority: "urgente", fixed: true, done: false, notes: "" },
  { id: 12, title: "Stories + CTA en IG", date: getWeekDates(0)[4].toISOString().split('T')[0], category: "instagram", priority: "importante", fixed: true, done: false, notes: "" },
  { id: 13, title: "Masaje o fisioterapia", date: getWeekDates(0)[5].toISOString().split('T')[0], category: "salud", priority: "rutina", fixed: true, done: false, notes: "Cita pendiente en centro especializado" },
  { id: 14, title: "Grupo WhatsApp: contenido", date: getWeekDates(0)[5].toISOString().split('T')[0], category: "email", priority: "rutina", fixed: true, done: false, notes: "" },
  { id: 15, title: "Planning semana siguiente", date: getWeekDates(0)[6].toISOString().split('T')[0], category: "admin", priority: "importante", fixed: true, done: false, notes: "" },
  { id: 16, title: "Preparar comidas saludables", date: getWeekDates(0)[6].toISOString().split('T')[0], category: "salud", priority: "rutina", fixed: true, done: false, notes: "Meal prep para toda la semana" },
];

function getWeekDates(weekOffset = 0) {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day === 0 ? -6 : 1 - day);
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function getTodayDayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export default function TaskDashboard() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("chony_tasks");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migrar tareas viejas a nueva estructura si usan 'day' en lugar de 'date'
        if (parsed.length > 0 && 'day' in parsed[0]) {
          const migrated = parsed.map(task => {
            const weekDates = getWeekDates(0);
            const date = weekDates[task.day].toISOString().split('T')[0];
            const { day, ...rest } = task;
            return { ...rest, date };
          });
          localStorage.setItem("chony_tasks", JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      }
      return SAMPLE_TASKS;
    } catch { return SAMPLE_TASKS; }
  });

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});
  const [showModal, setShowModal] = useState(false);
  const [filterCat, setFilterCat] = useState("all");
  const [filterPri, setFilterPri] = useState("all");
  const [newTask, setNewTask] = useState({ title: "", date: getWeekDates(0)[getTodayDayIndex()].toISOString().split('T')[0], category: "salud", priority: "importante", fixed: false, notes: "" });
  const [view, setView] = useState("week"); // week | day | category
  const [selectedCategory, setSelectedCategory] = useState(null);

  const weekDates = getWeekDates(weekOffset);
  const todayIdx = getTodayDayIndex();
  const isCurrentWeek = weekOffset === 0;

  useEffect(() => {
    try { localStorage.setItem("chony_tasks", JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  useEffect(() => {
    if (view === "day") {
      const currentWeekDates = getWeekDates(weekOffset);
      const selectedDateObj = new Date(selectedDate);
      const isCurrentWeek = currentWeekDates.some(d =>
        d.toDateString() === selectedDateObj.toDateString()
      );
      if (!isCurrentWeek) {
        setSelectedDate(currentWeekDates[Math.min(getTodayDayIndex(), 6)].toISOString().split('T')[0]);
      }
    }
  }, [weekOffset, view, selectedDate]);

  const toggleDone = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    setTasks(prev => [...prev, { ...newTask, id: Date.now(), done: false }]);
    setNewTask({ title: "", date: getWeekDates(0)[getTodayDayIndex()].toISOString().split('T')[0], category: "salud", priority: "importante", fixed: false, notes: "" });
    setShowModal(false);
  };

  const openCategoryView = (categoryId) => {
    setSelectedCategory(categoryId);
    setView("category");
  };

  const closeCategoryView = () => {
    setSelectedCategory(null);
    setView("week");
  };

  const filteredTasksByCategory = () => {
    if (!selectedCategory) return [];
    return tasks.filter(t => t.category === selectedCategory).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const filteredTasks = (date) => tasks.filter(t =>
    t.date === date &&
    (filterCat === "all" || t.category === filterCat) &&
    (filterPri === "all" || t.priority === filterPri)
  );

  const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
  const getPri = (id) => PRIORITIES.find(p => p.id === id) || PRIORITIES[1];

  const todayDate = new Date().toISOString().split('T')[0];
  const totalToday = filteredTasks(todayDate).length;
  const doneToday = filteredTasks(todayDate).filter(t => t.done).length;

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      color: "#fff",
      padding: "24px 16px",
    }}>
      {/* HEADER */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>
              🧠 Mi Ecosistema de Tareas
            </h1>
            <p style={{ margin: "4px 0 0", color: "#a78bfa", fontSize: 14 }}>
              IA que Convierte · Chony · {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => setView(view === "week" ? "day" : "week")}
              style={{ background: "rgba(167,139,250,0.2)", border: "1px solid #a78bfa", color: "#a78bfa", padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              {view === "week" ? "📅 Vista Día" : "📆 Vista Semana"}
            </button>
            <button onClick={() => setShowModal(true)}
              style={{ background: "linear-gradient(135deg, #7C3AED, #E1306C)", border: "none", color: "#fff", padding: "8px 20px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
              + Nueva Tarea
            </button>
          </div>
        </div>

        {/* PROGRESS HOY */}
        {isCurrentWeek && (
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>📊 Hoy · {DAYS[todayIdx]}</span>
            <div style={{ flex: 1, minWidth: 120, background: "rgba(255,255,255,0.1)", borderRadius: 20, height: 8, overflow: "hidden" }}>
              <div style={{ width: `${totalToday ? (doneToday / totalToday) * 100 : 0}%`, background: "linear-gradient(90deg, #7C3AED, #E1306C)", height: "100%", borderRadius: 20, transition: "width 0.4s" }} />
            </div>
            <span style={{ color: "#a78bfa", fontSize: 14, fontWeight: 600 }}>{doneToday}/{totalToday} completadas</span>
          </div>
        )}

        {/* FILTROS */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "6px 12px", borderRadius: 12, fontSize: 13, cursor: "pointer" }}>
            <option value="all">📁 Todas las áreas</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
          <select value={filterPri} onChange={e => setFilterPri(e.target.value)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "6px 12px", borderRadius: 12, fontSize: 13, cursor: "pointer" }}>
            <option value="all">🎯 Todas las prioridades</option>
            {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.dot} {p.label}</option>)}
          </select>
        </div>

        {/* NAVEGACIÓN SEMANA */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setWeekOffset(w => w - 1)}
            style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 18 }}>‹</button>
          <span style={{ fontWeight: 600, fontSize: 14, color: "#c4b5fd" }}>
            {weekDates[0].toLocaleDateString("es-ES", { day: "numeric", month: "short" })} – {weekDates[6].toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
            {isCurrentWeek && <span style={{ marginLeft: 8, background: "#7C3AED", padding: "2px 8px", borderRadius: 10, fontSize: 11 }}>Esta semana</span>}
          </span>
          <button onClick={() => setWeekOffset(w => w + 1)}
            style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 18 }}>›</button>
          {weekOffset !== 0 && (
            <button onClick={() => setWeekOffset(0)}
              style={{ background: "rgba(167,139,250,0.15)", border: "1px solid #a78bfa", color: "#a78bfa", padding: "4px 12px", borderRadius: 10, cursor: "pointer", fontSize: 12 }}>Hoy</button>
          )}
        </div>

        {/* VISTA SEMANA */}
        {view === "week" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
            {DAYS.map((day, idx) => {
              const date = weekDates[idx].toISOString().split('T')[0];
              const dayTasks = filteredTasks(date);
              const done = dayTasks.filter(t => t.done).length;
              const isToday = isCurrentWeek && idx === todayIdx;
              const isSelected = date === selectedDate;
              return (
                <div key={idx} onClick={() => { setSelectedDate(date); setView("day"); }}
                  style={{
                    background: isToday ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.05)",
                    border: isToday ? "1.5px solid #7C3AED" : isSelected ? "1.5px solid #a78bfa" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16, padding: 14, cursor: "pointer",
                    transition: "all 0.2s", position: "relative"
                  }}>
                  {isToday && <div style={{ position: "absolute", top: 8, right: 10, width: 7, height: 7, background: "#7C3AED", borderRadius: "50%" }} />}
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{day}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{weekDates[idx].toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</div>
                  <div style={{ marginTop: 10, fontSize: 22, fontWeight: 800, color: dayTasks.length ? "#fff" : "#475569" }}>{dayTasks.length}</div>
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>tareas{dayTasks.length > 0 && ` · ${done}✓`}</div>
                  {dayTasks.length > 0 && (
                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 3 }}>
                      {[...new Set(dayTasks.map(t => t.category))].slice(0, 3).map(cat => {
                        const c = getCat(cat);
                        return <span key={cat} style={{ fontSize: 13 }}>{c.icon}</span>;
                      })}
                    </div>
                  )}
                  {dayTasks.filter(t => t.notes && t.notes.trim()).length > 0 && (
                    <div style={{ marginTop: 6, fontSize: 10, color: "#a78bfa" }}>
                      📝 {dayTasks.filter(t => t.notes && t.notes.trim()).length} notas
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* VISTA DÍA */}
        {view === "day" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
              {DAYS.map((day, idx) => {
                const date = weekDates[idx].toISOString().split('T')[0];
                const isToday = isCurrentWeek && idx === todayIdx;
                const isSelected = date === selectedDate;
                return (
                  <button key={idx} onClick={() => setSelectedDate(date)}
                    style={{
                      background: isSelected ? "linear-gradient(135deg, #7C3AED, #E1306C)" : "rgba(255,255,255,0.07)",
                      border: isToday && !isSelected ? "1px solid #7C3AED" : "none",
                      color: "#fff", padding: "8px 14px", borderRadius: 12, cursor: "pointer",
                      fontWeight: isSelected ? 700 : 500, fontSize: 13, whiteSpace: "nowrap", flexShrink: 0
                    }}>
                    {day.slice(0, 3)} {weekDates[idx].getDate()}
                    {isToday && !isSelected && <span style={{ marginLeft: 4, fontSize: 9, color: "#a78bfa" }}>●</span>}
                  </button>
                );
              })}
            </div>

            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 20 }}>
              <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 800 }}>
                {new Date(selectedDate).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
              </h2>

              {["urgente", "importante", "rutina"].map(pri => {
                const priTasks = filteredTasks(selectedDate).filter(t => t.priority === pri);
                if (priTasks.length === 0) return null;
                const p = getPri(pri);
                return (
                  <div key={pri} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <span style={{ fontSize: 12 }}>{p.dot}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: 1 }}>{p.label}</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>({priTasks.length})</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {priTasks.map(task => {
                        const cat = getCat(task.category);
                        return (
                          <div key={task.id} style={{
                            display: "flex", alignItems: "flex-start", gap: 12,
                            background: task.done ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)",
                            borderLeft: `3px solid ${cat.color}`,
                            borderRadius: "0 12px 12px 0", padding: "10px 14px",
                            opacity: task.done ? 0.5 : 1, transition: "all 0.2s"
                          }}>
                            <input type="checkbox" checked={task.done} onChange={() => toggleDone(task.id)}
                              style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#7C3AED", flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontSize: 18, flexShrink: 0 }}>{cat.icon}</span>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: 14, fontWeight: 600, textDecoration: task.done ? "line-through" : "none", color: task.done ? "#64748b" : "#fff" }}>
                                {task.title}
                              </span>
                              <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                                <span style={{ fontSize: 10, background: cat.bg, color: cat.color, padding: "1px 6px", borderRadius: 6, fontWeight: 600 }}>{cat.label}</span>
                                {task.fixed && <span style={{ fontSize: 10, color: "#475569" }}>📌 Fija</span>}
                              </div>
                              {task.notes && task.notes.trim() && (
                                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6, fontStyle: "italic", lineHeight: 1.4 }}>
                                  📝 {task.notes}
                                </div>
                              )}
                            </div>
                            {!task.fixed && (
                              <button onClick={() => deleteTask(task.id)}
                                style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16, padding: 2, flexShrink: 0 }}>✕</button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredTasks(selectedDate).length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>✨</div>
                  <div style={{ fontSize: 14 }}>Sin tareas para este día</div>
                  <button onClick={() => setShowModal(true)}
                    style={{ marginTop: 12, background: "rgba(124,58,237,0.2)", border: "1px solid #7C3AED", color: "#a78bfa", padding: "6px 16px", borderRadius: 12, cursor: "pointer", fontSize: 13 }}>
                    Añadir tarea
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL NUEVA TAREA */}
        {showModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
            <div style={{ background: "#1e1b4b", borderRadius: 20, padding: 28, width: "100%", maxWidth: 420, border: "1px solid rgba(167,139,250,0.3)" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800 }}>✨ Nueva Tarea</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                  placeholder="Nombre de la tarea..."
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "10px 14px", borderRadius: 12, fontSize: 14 }} />
                <input type="date" value={newTask.date} onChange={e => setNewTask(p => ({ ...p, date: e.target.value }))}
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "10px 14px", borderRadius: 12, fontSize: 14, cursor: "pointer" }}
                />
                <select value={newTask.category} onChange={e => setNewTask(p => ({ ...p, category: e.target.value }))}
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "10px 14px", borderRadius: 12, fontSize: 14 }}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>
                <select value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "10px 14px", borderRadius: 12, fontSize: 14 }}>
                  {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.dot} {p.label}</option>)}
                </select>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
                  <input type="checkbox" checked={newTask.fixed} onChange={e => setNewTask(p => ({ ...p, fixed: e.target.checked }))}
                    style={{ accentColor: "#7C3AED" }} />
                  📌 Tarea fija (se repite cada semana)
                </label>
                <textarea value={newTask.notes} onChange={e => setNewTask(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Notas adicionales..."
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "10px 14px", borderRadius: 12, fontSize: 14, minHeight: 80, resize: "vertical", fontFamily: "inherit" }}
                />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={() => setShowModal(false)}
                  style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "none", color: "#94a3b8", padding: "10px", borderRadius: 12, cursor: "pointer", fontSize: 14 }}>
                  Cancelar
                </button>
                <button onClick={addTask}
                  style={{ flex: 2, background: "linear-gradient(135deg, #7C3AED, #E1306C)", border: "none", color: "#fff", padding: "10px", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                  Añadir Tarea
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VISTA POR CATEGORÍA */}
        {view === "category" && selectedCategory && (
          <div>
            <button onClick={closeCategoryView}
              style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 12, cursor: "pointer", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              ← Volver
            </button>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 20 }}>
              {(() => {
                const cat = getCat(selectedCategory);
                const catTasks = filteredTasksByCategory();
                return (
                  <>
                    <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800 }}>
                      {cat.icon} {cat.label} <span style={{ color: "#a78bfa", fontSize: 14, fontWeight: 500 }}>· {catTasks.length} tareas</span>
                    </h2>

                    {["urgente", "importante", "rutina"].map(pri => {
                      const priTasks = catTasks.filter(t => t.priority === pri);
                      if (priTasks.length === 0) return null;
                      const p = getPri(pri);
                      return (
                        <div key={pri} style={{ marginBottom: 24 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                            <span style={{ fontSize: 12 }}>{p.dot}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: 1 }}>{p.label}</span>
                            <span style={{ fontSize: 11, color: "#64748b" }}>({priTasks.length})</span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {priTasks.map(task => {
                              const taskDate = new Date(task.date);
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const taskDateNormalized = new Date(taskDate);
                              taskDateNormalized.setHours(0, 0, 0, 0);
                              const isPast = taskDateNormalized < today;
                              const isToday = taskDateNormalized.getTime() === today.getTime();
                              const isFuture = taskDateNormalized > today;
                              return (
                                <div key={task.id} style={{
                                  display: "flex", alignItems: "flex-start", gap: 12,
                                  background: task.done ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)",
                                  borderLeft: `3px solid ${cat.color}`,
                                  borderRadius: "0 12px 12px 0", padding: "14px 16px",
                                  opacity: task.done ? 0.6 : 1, transition: "all 0.2s"
                                }}>
                                  <input type="checkbox" checked={task.done} onChange={() => toggleDone(task.id)}
                                    style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#7C3AED", flexShrink: 0, marginTop: 2 }} />
                                  <span style={{ fontSize: 20, flexShrink: 0 }}>{cat.icon}</span>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                      <span style={{ fontSize: 15, fontWeight: 600, textDecoration: task.done ? "line-through" : "none", color: task.done ? "#64748b" : "#fff" }}>
                                        {task.title}
                                      </span>
                                      <span style={{
                                        fontSize: 11, padding: "2px 8px", borderRadius: 8, fontWeight: 600,
                                        background: isToday ? "#7C3AED" : isPast ? "#dc2626" : isFuture ? "#16A34A" : "#64748B",
                                        color: "#fff"
                                      }}>
                                        {isToday ? "HOY" : taskDate.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                                      </span>
                                    </div>
                                    <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                                      <span style={{ fontSize: 10, background: cat.bg, color: cat.color, padding: "1px 6px", borderRadius: 6, fontWeight: 600 }}>{cat.label}</span>
                                      {task.fixed && <span style={{ fontSize: 10, color: "#475569" }}>📌 Fija</span>}
                                    </div>
                                    {task.notes && task.notes.trim() && (
                                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6, fontStyle: "italic", lineHeight: 1.4 }}>
                                        📝 {task.notes}
                                      </div>
                                    )}
                                  </div>
                                  {!task.fixed && (
                                    <button onClick={() => deleteTask(task.id)}
                                      style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16, padding: 2, flexShrink: 0 }}>✕</button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {catTasks.length === 0 && (
                      <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569" }}>
                        <div style={{ fontSize: 40, marginBottom: 8 }}>✨</div>
                        <div style={{ fontSize: 14 }}>Sin tareas en esta categoría</div>
                        <button onClick={() => setShowModal(true)}
                          style={{ marginTop: 12, background: "rgba(124,58,237,0.2)", border: "1px solid #7C3AED", color: "#a78bfa", padding: "6px 16px", borderRadius: 12, cursor: "pointer", fontSize: 13 }}>
                          Añadir tarea
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* LEYENDA */}
        <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => openCategoryView(c.id)}
              style={{ fontSize: 11, background: "rgba(255,255,255,0.05)", border: `1px solid ${c.color}40`, color: "#94a3b8", padding: "4px 10px", borderRadius: 20, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}
              onMouseEnter={(e) => e.target.style.background = `${c.color}20`}
              onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.05)"}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
