// Button component testi
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '@project/ui';

describe('Button', () => {
  it('metin render edilir', () => {
    render(<Button>Tikla</Button>);
    expect(screen.getByRole('button', { name: 'Tikla' })).toBeInTheDocument();
  });

  it('disabled durumda tiklanamaz', () => {
    render(<Button isDisabled>Tikla</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('loading durumda yukleniyor gosterir', () => {
    render(<Button isLoading>Tikla</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Yukleniyor...');
  });
});
