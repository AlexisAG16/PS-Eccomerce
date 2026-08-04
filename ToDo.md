# Rutas que quedan quedan por hacer:

Solo me interesa que lo diseñen, para eso directamente creen la ruta y accedan a ella mediante el url. Comportamientos, consultas a API y demás cosas lo veremos más adelante.
Vayan marcando (o borrando) lo que ya hicieron.
Algunas cosas seguro ya las hicieron antes asi que borren nomas.

## Glosario

Dashboard: sección que permite visualizar datos (usuarios, productos, etc.). Permite búsquedas, acceder a datos de forma individual, filtros, paginación y sus respectivos botones de "crear nuevo", "editar", "borrar"
Formularios: puede ser una barra de búsqueda, registro, filtro, etc. En el caso de formulario de ingreso y edición, son lo mismo, pero se usan en contextos diferentes (recomiendo hacer el de ingreso solamente, porque el de edición cambia un par de cosas y listo)
En detalle: le decimos a la acción de poder visualizar dentro de su propia página o modal un elemento de la base de datos.

## PRODUCTOS
- Dashboard de productos (admin)
- Pantalla principal (muestra varias categorías, productos recomendados, etc)
- Formulario de ingreso (admin)
- Formulario de edición (admin)

## CATEGORÍAS
- Dashboard de categorías (clickear una debería redireccionarte a productos con esa categoría)
- Categoría en detalle
- Formulario de ingreso (admin)
- Formulario de edición (admin)

## AUTENTICACIÓN
- Usuario a detalle (informacion completa del usuario)
  - Ingresar botón de olvidar contraseña
- Formulario de registro
- Formulario de ingreso
- Formulario de edición (solo debe permitir cambiar nombre, apellido, fecha de nacimiento, teléfono y dirección)
- Formulario de cambio de contraseña

## USUARIO
- Dashboard (solo para admin/operador)
- Usuario a detalle (informacion completa del usuario)
- Formulario de ingreso (encontrar la forma de poder ingresar tu ubicación mediante una API de mapa tipo google maps)
- Formulario de edición

## REGISTRO DE AUDITORÍA
- Dashboard (solo para admin/operador) (solo lectura, aquí aparece toda actividad realizada dentro del sistema, y por consiguiente, nada debe poder eliminarse o modificarse)

## ORDENES
- Dashboard (solo para admin/operador) (aquí dentro debe existir la posibilidad para modificar el estado del envío)
- órden a detalle
- Formulario de ingreso para usuarios invitados (sin cuenta)

## PAGOS
- Dashboard (solo para admin/operador) (aquí nada debe poderse editar ni borrar, solo lectura)
- Pago a detalle

## ENVÍOS
- Dashboard (solo para admin/operador) (aquí dentro debe existir la posibilidad para modificar el estado del envío)
- Envío a detalle
- Vista que diga "producto en camino"
- Vista que diga "retirar en tienda"

## DESCUENTOS
- Dashboard (solo para admin/operador)
- Formulario de ingreso
- Formulario de edición

## CUPONES
- Dashboard (solo para admin/operador)
- Formulario de ingreso
- Formulario de edición

## PUNTOS
- Tienda de puntos
- Minijuegos como modal
- Dashboard de tienda de puntos (accesos a 'ventajas' que se pueden comprar con puntos)

## EXTRAS
- Pantalla de "no encontrado"
- Pantalla de "sin permisos"
- Pantalla de "pago fallido"
- Pantalla de "pago exitoso" (aquí se debería poder ganar puntos y un "te ganaste acceso a un minijuego para ganar mas puntos")
