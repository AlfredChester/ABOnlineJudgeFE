/* eslint-disable semi */
const stack = [] // 先进后出，每一次出栈，即一对 ()
const parenthesesPairPosition = {}

// 剔除两侧空格
const removeBlank = (expression, l, r) => {
  while (expression[l] === ' ') {
    l++
  }
  while (expression[r] === ' ') {
    r--
  }
  return [l, r]
}

// 剔除两侧小括号
const removeParentheses = (l, r) => {
  if (parenthesesPairPosition[l] === r) return [++l, --r]

  return [l, r]
}

const parse = (expression, l = 0, r = expression.length - 1, skipSearchTimeOrDivide = false) => {
  let isNumber = true;
  let parenthesesDep = 0; // 记录小括号深度
  let firstTimeOrDivideOperator = null; // 记录遇到的第一个 * / 运算符
  let firstTimeOrDivideOperatorIdx = null; // 记录遇到的第一个 * / 运算符的位置

  [l, r] = removeBlank(expression, l, r);
  [l, r] = removeParentheses(l, r);

  for (let i = r; i >= l; i--) {
    const v = expression[i];

    if (v === ')') {
      stack.push(i)
      parenthesesDep++
    } else if (v === '(') {
      const last = stack.pop()
      parenthesesPairPosition[i] = last
      parenthesesDep--
    }

    // skipSearchTimeOrDivide 为 true 表示表达式是连续的 * /
    if (skipSearchTimeOrDivide && firstTimeOrDivideOperator) {
      return {
        type: firstTimeOrDivideOperator,
        left: parse(expression, l, firstTimeOrDivideOperatorIdx - 1, true),
        right: parse(expression, firstTimeOrDivideOperatorIdx + 1, r)
      }
    }

    if (i === l) {
      if (isNumber) {
        return {
          type: 'number',
          value: Number(expression.slice(l, r + 1).trim())
        };
      }

      if (parenthesesPairPosition[i] === r) {
        return parse(expression, l + 1, r - 1)
      }

      // * / 拆分，需要遍历到最左侧，所里拆分逻辑写这里
      return {
        type: firstTimeOrDivideOperator,
        left: parse(expression, l, firstTimeOrDivideOperatorIdx - 1, true),
        right: parse(expression, firstTimeOrDivideOperatorIdx + 1, r)
      }
    }

    if (/[0-9]/.test(v) || v === ' ') {
      continue;
    }

    isNumber = false;

    // parenthesesDep === 0 进行表达式分析的时候要确保是同一层级
    if (parenthesesDep === 0 && (v === '+' || v === '-')) {
      return {
        type: v,
        left: parse(expression, l, i - 1),
        right: parse(expression, i + 1, r)
      }
    }

    if (parenthesesDep === 0 && (v === '*' || v === '/') && !firstTimeOrDivideOperator) {
      firstTimeOrDivideOperator = v
      firstTimeOrDivideOperatorIdx = i
    }
  }
}

const exec = ast => {
  const recursion = ast => {
    if (ast.type === '+') {
      return recursion(ast.left) + recursion(ast.right)
    } else if (ast.type === '-') {
      return recursion(ast.left) - recursion(ast.right)
    } else if (ast.type === '*') {
      return recursion(ast.left) * recursion(ast.right)
    } else if (ast.type === '/') {
      return recursion(ast.left) / recursion(ast.right)
    } else if (ast.type === 'number') {
      return ast.value
    }
  }
  return recursion(ast)
}

const calc = (expression) => {
  return exec(parse(expression))
}

export default {
  calc
}
