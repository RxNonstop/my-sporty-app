---
name: minimalist_ui_design
description: Directrices para crear diseños de UI minimalistas y limpios.
---

# Minimalist UI Design Skill

Cuando se te pida aplicar estilos o diseñar una vista, debes seguir estrictamente este patrón minimalista:

1. **Minimalismo y Simplicidad**:
   - Evita diseños sobrecargados o "típicos de IA".
   - Mantén las interfaces limpias con abundante espacio en blanco (whitespace).
   - Estructura la información de manera ordenada (ej. listas, grids simples).

2. **Uso del Color**:
   - Evita los degradados (gradients). Usar solo colores sólidos.
   - Utiliza una paleta neutra (blancos, grises claros, negros mates) para la estructura general.
   - Utiliza colores **solo para denotar funcionalidades** o estados (por ejemplo: verde para activo/abierto, rojo para error/cerrado, azul para acciones o enlaces).

3. **Efectos de Profundidad (Sombras)**:
   - **No uses sombras pesadas**. Si es estrictamente necesario, usa bordes sutiles (border width 1, color gris muy claro) en lugar de sombras, o sombras extremadamente suaves e imperceptibles.

4. **Tipografía y Legibilidad**:
   - Los textos deben tener una legibilidad clara pero **no ser tan grandes**. 
   - Usa tamaños moderados (ej. `14px` o `12px` para información secundaria, `16px` o `18px` máximo para títulos de secciones).
   - Juega con el peso de la fuente (fontWeight) y el color (gris oscuro vs gris medio) para jerarquizar la información, en lugar de aumentar excesivamente el tamaño de la tipografía.

5. **Elementos UI**:
   - **Botones**: Claros, con un radio de borde moderado (ej. 4px a 8px), sin sombras exóticas.
   - **Badges/Etiquetas**: Para estados (estado, privacidad), usa fondos pasteles o tenues con el texto en un color contrastante sólido correspondiente a la funcionalidad elegida.

6. **Estilos siempre en tailwindcss**:
   - No uses estilos en línea (inline styles).
   - Usa siempre tailwindcss para aplicar estilos.
   - Aplica estilos tanto para el light mode como también para el dark mode.
