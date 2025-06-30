export const CODE_TEMPLATES: Record<string, string> = {
  Python: `print("Hola Mundo")
nombre = "CodeFarm"
print(f"Bienvenido a {nombre}")
for i in range(3):
    print(f"Número: {i}")`,
  Java: `public class HolaMundo {
    public static void main (String[] args) {
        System.out.println("Hola Mundo");
        String nombre = "CodeFarm";
        System.out.println("Bienvenido a " + nombre);
        for(int i = 0; i < 3; i++) {
            System.out.println("Número: " + i);
        }
    }
}`,
  JavaScript: `console.log("Hola Mundo");
const nombre = "CodeFarm";
console.log(\`Bienvenido a \${nombre}\`);
for(let i = 0; i < 3; i++) {
    console.log(\`Número: \${i}\`);
}`,
  Html: `<!DOCTYPE html>
<html>
  <head>
    <title>Hola Mundo</title>
  </head>
  <body>
    <h1>Hola Mundo</h1>
    <p>Bienvenido a CodeFarm</p>
  </body>
</html>`,
  MySQL: `SELECT 'Hola Mundo' as mensaje;
SELECT 'Bienvenido a CodeFarm' as saludo;
SELECT 1 as numero UNION SELECT 2 UNION SELECT 3;`,
};

export const getFileExtension = (language: string): string => {
  const extensions: Record<string, string> = {
    Python: '.py',
    Java: '.java',
    JavaScript: '.js',
    Html: '.html',
    MySQL: '.sql'
  };
  return extensions[language] || '.txt';
};