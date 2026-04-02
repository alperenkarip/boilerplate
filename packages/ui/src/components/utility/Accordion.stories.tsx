// Accordion component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Utility/Accordion',
  component: Accordion,
};
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    title: 'Sikca Sorulan Sorular',
    children: 'Bu bir ornek icerik metnidir. Accordion acildiginda buradaki icerik goruntulenir.',
  },
};

export const DefaultOpen: Story = {
  args: {
    title: 'Baslangicta Acik Panel',
    children: 'Bu panel varsayilan olarak acik sekilde render edilir.',
    defaultOpen: true,
  },
};

export const LongContent: Story = {
  args: {
    title: 'Uzun Icerikli Panel',
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
};

/** Birden fazla Accordion bir arada */
export const Multiple: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '480px' }}>
      <Accordion title="Teslimat suresi ne kadar?">
        Siparisleriniz genellikle 2-5 is gunu icerisinde teslim edilir.
      </Accordion>
      <Accordion title="Iade politikasi nedir?">
        Urunlerimizi 14 gun icerisinde iade edebilirsiniz.
      </Accordion>
      <Accordion title="Odeme yontemleri nelerdir?">
        Kredi karti, banka karti ve havale ile odeme yapabilirsiniz.
      </Accordion>
    </div>
  ),
};
