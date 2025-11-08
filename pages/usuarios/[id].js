import { useRouter } from 'next/router';
import UsuarioFormPage from '../../src/modules/usuarios/UsuarioFormPage';

export default function EditarUsuario() {
  const router = useRouter();
  const { id } = router.query;
  
  return <UsuarioFormPage usuarioId={id} />;
}
