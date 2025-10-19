# 🤝 Contribuir al proyecto

¡Gracias por tu interés en contribuir a **Angular Clean Architecture Boilerplate**!

## 📋 Cómo contribuir

### 1. **Fork del repositorio**

```bash
# Hacer fork desde GitHub y luego clonar
git clone https://github.com/tu-usuario/angular-clean-architecture.git
cd angular-clean-architecture
```

### 2. **Configurar el entorno**

```bash
# Instalar dependencias
npm install

# Verificar que todo funciona
npm run build
npm run test
npm run lint
```

### 3. **Crear una rama para tu feature**

```bash
git checkout -b feature/nombre-de-tu-feature
```

### 4. **Realizar cambios**

- Sigue las convenciones de código del proyecto
- Agrega tests si es necesario
- Actualiza la documentación si es relevante

### 5. **Verificar calidad del código**

```bash
# Formatear código
npm run format

# Verificar linting
npm run lint:fix

# Ejecutar tests
npm test

# Verificar tipos
npm run type-check
```

### 6. **Commit y Push**

```bash
# Commit siguiendo convenciones
git commit -m "feat: agregar nueva funcionalidad"

# Push a tu fork
git push origin feature/nombre-de-tu-feature
```

### 7. **Crear Pull Request**

- Ve a GitHub y crea un Pull Request
- Describe claramente los cambios realizados
- Referencia issues relacionados si los hay

## 📝 Convenciones de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan funcionalidad)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

### Ejemplos:

```bash
git commit -m "feat: agregar servicio de autenticación"
git commit -m "fix: corregir error en validación de formularios"
git commit -m "docs: actualizar README con nuevas instrucciones"
```

## 🎯 Tipos de contribuciones

### **🐛 Reportar bugs**

- Usa el template de issue para bugs
- Incluye pasos para reproducir
- Especifica versión de Angular y navegador

### **💡 Sugerir features**

- Usa el template de issue para features
- Explica el caso de uso
- Considera el impacto en la arquitectura

### **📚 Mejorar documentación**

- Corregir typos
- Agregar ejemplos
- Mejorar explicaciones

### **🔧 Contribuir código**

- Nuevas funcionalidades
- Corrección de bugs
- Mejoras de rendimiento
- Refactorizaciones

## 📏 Estándares de código

### **Naming conventions:**

- **Archivos**: `kebab-case.type.ts`
- **Clases**: `PascalCase`
- **Variables/Métodos**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase` + sufijo `Entity` o `Interface`

### **Estructura de archivos:**

```typescript
// 1. Angular core imports
import { Component, OnInit } from '@angular/core';

// 2. Third-party imports
import { Observable } from 'rxjs';

// 3. Internal imports (usando path mapping)
import { MyService } from '@core/services';
import { MyEntity } from '@shared/entities';
```

### **Documentación de código:**

````typescript
/**
 * Descripción clara del método
 *
 * @param param1 - Descripción del parámetro
 * @returns Descripción del valor de retorno
 *
 * @example
 * ```typescript
 * const result = myMethod('example');
 * ```
 */
public myMethod(param1: string): string {
  return param1.toUpperCase();
}
````

## 🧪 Testing

### **Escribir tests:**

- Tests unitarios para servicios
- Tests de componentes para UI
- Tests de integración para flujos completos

### **Ejecutar tests:**

```bash
# Todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Cobertura de código
npm run test:coverage
```

## 🔍 Code Review

### **Criterios de revisión:**

- ✅ Sigue las convenciones del proyecto
- ✅ Incluye tests apropiados
- ✅ Documentación actualizada
- ✅ No rompe funcionalidad existente
- ✅ Mejora la calidad del código

### **Proceso:**

1. El PR debe pasar todos los checks automáticos
2. Al menos un maintainer debe aprobar
3. Resolver todos los comentarios
4. Merge después de aprobación

## 🚀 Release Process

### **Versionado:**

Seguimos [Semantic Versioning](https://semver.org/):

- `MAJOR`: Cambios incompatibles
- `MINOR`: Nueva funcionalidad compatible
- `PATCH`: Correcciones de bugs

### **Changelog:**

- Mantener CHANGELOG.md actualizado
- Documentar breaking changes
- Listar nuevas funcionalidades

## 📞 Contacto

¿Tienes preguntas sobre cómo contribuir?

- 💬 **Discusiones**: [GitHub Discussions](https://github.com/your-username/angular-clean-architecture/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/angular-clean-architecture/issues)
- 📧 **Email**: maintainers@angular-clean-architecture.com

## 🙏 Reconocimientos

Todos los contribuidores serán reconocidos en:

- README.md
- CONTRIBUTORS.md
- Release notes

¡Gracias por hacer este proyecto mejor! 🎉
