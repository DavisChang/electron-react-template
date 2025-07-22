import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const markdown = `
# Math in Markdown

This is an inline math example: $E = mc^2$.

This is a block math example:

$$
\\int_0^\\infty e^{-x^2} dx = \\sqrt{\\pi}/2
$$
`;

const MarkdownWithMath = () => {
  return (
    <ReactMarkdown
      children={markdown}
      remarkPlugins={[remarkMath]} // Parses math expressions
      rehypePlugins={[rehypeKatex]} // Renders math visually
    />
  );
};

export default MarkdownWithMath;
