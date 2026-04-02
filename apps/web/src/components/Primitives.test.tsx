// Primitive component testleri (I.1.6)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Text,
  Heading,
  Box,
  Stack,
  Inline,
  Spacer,
  Pressable,
  Divider,
  ScrollContainer,
} from '@project/ui';

describe('Text', () => {
  it('children render edilir', () => {
    render(<Text>Merhaba</Text>);
    expect(screen.getByText('Merhaba')).toBeInTheDocument();
  });
});

describe('Heading', () => {
  it('dogru seviyede render edilir', () => {
    render(<Heading level={3}>Baslik</Heading>);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Baslik');
  });
});

describe('Box', () => {
  it('children render edilir', () => {
    render(<Box data-testid="box">Icerik</Box>);
    expect(screen.getByTestId('box')).toHaveTextContent('Icerik');
  });
});

describe('Stack', () => {
  it('children dikey render edilir', () => {
    render(
      <Stack data-testid="stack">
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    expect(screen.getByTestId('stack').children).toHaveLength(2);
  });
});

describe('Inline', () => {
  it('children yatay render edilir', () => {
    render(
      <Inline data-testid="inline">
        <span>A</span>
        <span>B</span>
      </Inline>,
    );
    expect(screen.getByTestId('inline').style.flexDirection).toBe('row');
  });
});

describe('Spacer', () => {
  it('aria-hidden olur', () => {
    const { container } = render(<Spacer />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('Pressable', () => {
  it('disabled durumda aria-disabled olur', () => {
    render(<Pressable isDisabled>Tikla</Pressable>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('Divider', () => {
  it('aria-hidden olur', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('hr')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('ScrollContainer', () => {
  it('overflow-y auto olur', () => {
    render(<ScrollContainer data-testid="sc">Icerik</ScrollContainer>);
    expect(screen.getByTestId('sc').style.overflowY).toBe('auto');
  });
});
