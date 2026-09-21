/**
 * Safe, accurate mathematical expression parser and evaluator.
 * Handles +, -, ×, ÷, %, parentheses, negative numbers, and floating point inaccuracies.
 */

export function cleanFloat(num: number): number {
  if (!isFinite(num)) return num;
  // Eliminate floating point representation errors like 0.1 + 0.2 = 0.30000000000000004
  return parseFloat(num.toPrecision(14));
}

export function formatDisplayNumber(rawNumStr: string): string {
  if (!rawNumStr) return '0';
  if (rawNumStr === '-' || rawNumStr === 'Error' || rawNumStr === 'Erreur') return rawNumStr;
  if (rawNumStr.includes('e') || rawNumStr.includes('E')) return rawNumStr;

  const parts = rawNumStr.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : null;

  // Format integer part with spaces as thousands separator
  const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  if (decimalPart !== null) {
    return `${formattedInt}.${decimalPart}`;
  }
  return formattedInt;
}

export function formatExpression(expr: string): string {
  return expr
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' ÷ ')
    .replace(/\+/g, ' + ')
    .replace(/(?<=\d|\))\-(?=\d|\()/g, ' − ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenize mathematical expression
 */
export function tokenize(expression: string): string[] {
  // Normalize symbols
  const sanitized = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/\s+/g, '');

  const tokens: string[] = [];
  let i = 0;

  while (i < sanitized.length) {
    const char = sanitized[i];

    if (/[0-9.]/.test(char)) {
      let numStr = '';
      while (i < sanitized.length && /[0-9.]/.test(sanitized[i])) {
        numStr += sanitized[i];
        i++;
      }
      tokens.push(numStr);
      continue;
    }

    // Handle unary minus (e.g. at start or right after another operator or '(')
    if (char === '-') {
      const prev = tokens[tokens.length - 1];
      const isUnary = tokens.length === 0 || ['+', '-', '*', '/', '(', '^'].includes(prev);
      if (isUnary) {
        // Lookahead to see if next is number
        let nextI = i + 1;
        if (nextI < sanitized.length && /[0-9.]/.test(sanitized[nextI])) {
          let numStr = '-';
          i++;
          while (i < sanitized.length && /[0-9.]/.test(sanitized[i])) {
            numStr += sanitized[i];
            i++;
          }
          tokens.push(numStr);
          continue;
        }
      }
    }

    if (['+', '-', '*', '/', '%', '(', ')', '^'].includes(char)) {
      tokens.push(char);
      i++;
      continue;
    }

    i++;
  }

  return tokens;
}

/**
 * Safe parser using Shunting-Yard algorithm (Infix to RPN) then evaluating RPN
 */
export function evaluateExpression(expression: string): { result?: number; error?: string } {
  try {
    const tokens = tokenize(expression);
    if (tokens.length === 0) return { result: 0 };

    const precedence: Record<string, number> = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
      '%': 2,
      '^': 3,
    };

    const outputQueue: string[] = [];
    const operatorStack: string[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (!isNaN(Number(token))) {
        outputQueue.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop()!);
        }
        if (operatorStack.length === 0) {
          return { error: 'Parenthèse non fermée' };
        }
        operatorStack.pop(); // Pop '('
      } else if (['+', '-', '*', '/', '%', '^'].includes(token)) {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== '(' &&
          precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.push(token);
      }
    }

    while (operatorStack.length > 0) {
      const top = operatorStack.pop()!;
      if (top === '(' || top === ')') {
        return { error: 'Erreur de syntaxe' };
      }
      outputQueue.push(top);
    }

    // Evaluate RPN
    const evalStack: number[] = [];

    for (const token of outputQueue) {
      if (!isNaN(Number(token))) {
        evalStack.push(Number(token));
      } else {
        if (evalStack.length < 2) {
          return { error: 'Expression incomplète' };
        }
        const b = evalStack.pop()!;
        const a = evalStack.pop()!;

        let res = 0;
        switch (token) {
          case '+':
            res = a + b;
            break;
          case '-':
            res = a - b;
            break;
          case '*':
            res = a * b;
            break;
          case '/':
            if (b === 0) {
              return { error: 'Division par zéro' };
            }
            res = a / b;
            break;
          case '%':
            res = (a * b) / 100;
            break;
          case '^':
            res = Math.pow(a, b);
            break;
          default:
            return { error: 'Opérateur inconnu' };
        }
        evalStack.push(res);
      }
    }

    if (evalStack.length !== 1) {
      return { error: 'Erreur de calcul' };
    }

    const finalVal = cleanFloat(evalStack[0]);
    return { result: finalVal };
  } catch {
    return { error: 'Erreur de calcul' };
  }
}
