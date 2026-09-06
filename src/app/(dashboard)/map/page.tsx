import { redirect } from 'next/navigation';

export default function MapPageRedirect() {
  redirect('/cases/CASE-102?tab=map');
}
