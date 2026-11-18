<template>
  <!-- Ranking Global (se movió aquí desde MiProgreso.vue en UI-04, sin cambios de contenido).
       UI-06: solo cambia el aspecto, para que combine con el resto de Progreso. La lógica y los
       datos del ranking son tarea de otro integrante del equipo; aquí sigue el aviso "Próximamente". -->
  <section class="ranking" aria-labelledby="ranking-titulo" data-test="ranking">
    <div class="ranking__cabecera">
      <span class="ranking__icono" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#2568c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20 V13 H9 V20 M9 20 V8 H15 V20 M15 20 V11 H20 V20 M2 20 H22" /></svg>
      </span>
      <h2 id="ranking-titulo" class="ranking__titulo">Ranking Global</h2>
      <span class="ranking__etiqueta">
        <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="M10 6 V10 L12.5 12" /></svg>
        Próximamente
      </span>
    </div>
    <!-- UI-10: mismo texto, con Leo al lado. Antes: <p class="ranking__texto">Función en desarrollo.</p> -->
    <div class="ranking__vacio" data-test="ranking-vacio">
      <LeoPersonaje :tamano="64" decorativo />
      <p class="ranking__texto">Función en desarrollo.</p>
    </div>
  </section>
</template>

<script>
import LeoPersonaje from './base/LeoPersonaje.vue' // UI-10

export default { name: 'RankingGlobal', components: { LeoPersonaje } }
</script>

<style scoped>
.ranking {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.125rem;
  background: #ffffff;
  border: 1px solid #d9e4f1;
  border-radius: 1.25rem;
  box-shadow: 0 1px 2px rgba(20, 35, 59, 0.05);
  text-align: left;
  font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
}
.ranking__cabecera { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.ranking__icono {
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  border-radius: 0.875rem;
  background: #e4f0fb;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ranking__titulo {
  flex: 1;
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.125rem;
  color: #14233b;
}
.ranking__etiqueta {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  background: #fff3cf;
  color: #8a5a00;
  font-size: 0.8125rem;
  font-weight: 700;
}
.ranking__texto { margin: 0; font-size: 0.9375rem; color: #52627a; }
.ranking__vacio { display: flex; align-items: center; gap: 0.875rem; padding: 0.875rem; background: #f4f8fd; border-radius: 1rem; } /* UI-10 */
.ranking__vacio > :first-child { flex-shrink: 0; }

@media (min-width: 768px) {
  .ranking { padding: 1.5rem; }
  .ranking__titulo { font-size: 1.375rem; }
}
</style>
