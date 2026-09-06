# PRODUCT.md — EduAlex • Enlaces

## Qué es
Hub de enlaces ("link in bio") de EduAlex en `edualex.uy`. Una sola página que reúne
todos los recursos, plataformas y herramientas digitales de EduAlex para potenciar
la educación media en Uruguay.

## Audiencia
Docentes y estudiantes de educación media en Uruguay, mayormente en móvil,
a menudo con una mano en el aula. Español (es-UY).

## Objetivo único
Que el visitante encuentre y toque el enlace que busca en segundos.

## Contenido
Fuente de verdad: `public/links.json` (`avatar`, `name`, `bio`, `theme`, `links`).
Cada enlace: `title`, `url`, `icon` (lucide), `color` (tinte del icono), `desc`
(visible solo en desktop; mobile muestra solo título).

## Identidad visual (incumbente)
- Oscuro minimalista mobile-first: fondo casi negro, tarjetas sutiles, radio 14px.
- Sin bento ni efectos 3D: lista vertical calma en móvil, grilla uniforme de 2
  columnas en desktop (≥640px).
- Buscador con filtro instantáneo (insensible a tildes), estado vacío y contador.
- Tipografía del sistema, tracking levemente negativo, una sola animación de entrada.
- Tono: sobrio, docente, sin marketing. Footer: `EduAlex · <año>`.

## Restricciones
- No agregar copy ni claims nuevos sin pedirlo; los textos viven en `links.json`.
- Mobile intocable en espíritu: simple, rápido, pulgar-amigable.
- Accesibilidad: foco visible, `prefers-reduced-motion`, contraste ≥4.5:1 en texto.
