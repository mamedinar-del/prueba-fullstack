import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MiPerfil from './MiPerfil';
import * as AuthContext from '../context/AuthContext';
import * as dataService from '../services/dataService';

vi.mock('../services/dataService', () => ({
    actualizarUsuarioAPI: vi.fn()
}));

describe('Pruebas en MiPerfil.jsx', () => {

    it('14. Carga los datos del usuario en los inputs', () => {
        const mockUser = { 
            id: 1, nombre: 'Test', 
            region: 'RM', comuna: 'Santiago', calle: 'Alameda', numero: '123' 
        };
        
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: mockUser });

        render(<MiPerfil />);

        expect(screen.getByDisplayValue('Alameda')).toBeInTheDocument();
        expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    });

    it('15. Enviar formulario llama a actualizarUsuarioAPI', async () => {
        const mockUser = { id: 1, nombre: 'Test' };
        const mockUpdate = vi.fn();
        
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: mockUser, updateUser: mockUpdate });
        
        dataService.actualizarUsuarioAPI.mockResolvedValue({ ...mockUser, calle: 'Nueva' });

        const { container } = render(<MiPerfil />);

        const btn = screen.getByText(/Guardar Cambios/i);
        
        fireEvent.submit(btn.closest('form'));

        await waitFor(() => {
            expect(dataService.actualizarUsuarioAPI).toHaveBeenCalled();
        });
    });
});