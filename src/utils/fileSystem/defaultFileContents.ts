/**
 * Contenidos por defecto para diferentes tipos de archivos
 */

export const DEFAULT_FILE_CONTENTS = {
  'js': `// JavaScript File
console.log("Hello World!");

function greet(name) {
    return \`Hello, \${name}!\`;
}

const message = greet("Developer");
console.log(message);
`,

  'html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to My App</h1>
        <p>This is a sample HTML file</p>
        <button onclick="sayHello()">Click Me!</button>
    </div>
    <script src="script.js"></script>
</body>
</html>
`,

  'css': `/* CSS Stylesheet */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    color: #333;
    text-align: center;
}

button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    background-color: #0056b3;
}
`,

  'md': `# My Project

Welcome to my awesome project! 🚀

## Features

- ✅ Modern UI/UX
- ✅ Cross-platform compatibility
- ✅ Fast performance
- ✅ Easy to use

## Getting Started

1. Clone the repository
2. Install dependencies
3. Run the project

\`\`\`bash
npm install
npm start
\`\`\`

## Contributing

Feel free to contribute to this project by:

- Reporting bugs
- Suggesting new features
- Submitting pull requests

---

*Made with ❤️ by the community*
`,

  'json': `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "An awesome project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest",
    "build": "webpack --mode=production"
  },
  "keywords": [
    "javascript",
    "node",
    "web"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "webpack": "^5.0.0"
  }
}
`,

  'py': `# Python Script
def greet(name):
    """
    Greet someone with a personalized message
    """
    return f"Hello, {name}!"

def calculate_fibonacci(n):
    """
    Calculate the nth Fibonacci number
    """
    if n <= 1:
        return n
    else:
        return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# Main execution
if __name__ == "__main__":
    print(greet("World"))
    
    # Calculate first 10 Fibonacci numbers
    print("First 10 Fibonacci numbers:")
    for i in range(10):
        print(f"F({i}) = {calculate_fibonacci(i)}")
`,

  'tsx': `import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface Props {
  title: string;
}

const MyComponent: React.FC<Props> = ({ title }) => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.counter}>Count: {count}</Text>
      <Button title="Increment" onPress={handleIncrement} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  counter: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default MyComponent;
`,

  'txt': `Welcome to your new text file!

This is a plain text file where you can write:
- Notes
- Documentation
- Ideas
- Anything you want!

Feel free to edit this content and make it your own.
`,

  'default': `// New File
// Start coding here...

console.log("Hello, World!");
`
};

export const getDefaultContentByExtension = (extension: string): string => {
  return DEFAULT_FILE_CONTENTS[extension as keyof typeof DEFAULT_FILE_CONTENTS] || DEFAULT_FILE_CONTENTS.default;
};

export const getDefaultContentByFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || 'default';
  return getDefaultContentByExtension(extension);
};
