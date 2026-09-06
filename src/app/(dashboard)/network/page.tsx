import { redirect } from 'next/navigation';

export default function NetworkPageRedirect() {
  redirect('/cases/CASE-102?tab=network');
}
