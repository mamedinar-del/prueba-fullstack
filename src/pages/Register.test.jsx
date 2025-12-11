import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
import * as dataService from '../services/dataService';

vi.mock('../services/dataService', () => ({
    registerAPI: vi.fn()
}));

const renderRegister = () => {
    return render(<BrowserRouter><Register /></BrowserRouter>);
};

describe('Pruebas en Register.jsx', () => {
    
    it('Debe renderizar los campos obligatorios del formulario', () => {
        const { container } = renderRegister();
        expect(container.querySelector('input[name="nombre"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="rut"]')).toBeInTheDocument();
    });

    it('Debe mostrar error si las contraseñas no coinciden', async () => {
        const { container } = renderRegister();
        const btn = screen.getByRole('button', { name: /Registrarse/i }); 
        
        fireEvent.change(container.querySelector('input[name="nombre"]'), { target: { value: 'Test' } });
        fireEvent.change(container.querySelector('input[name="password"]'), { target: { value: 'Pass123$' } });
        fireEvent.change(container.querySelector('input[name="confirmPassword"]'), { target: { value: 'Pass999$' } });
        
        fireEvent.submit(btn.closest('form'));
        
        await waitFor(() => {
            expect(screen.getByText(/coinciden/i)).toBeInTheDocument();
        });
    });

    it('Debe mostrar error si el email no es válido', async () => {
        const { container } = renderRegister();
        const btn = screen.getByRole('button', { name: /Registrarse/i });
        
        fireEvent.change(container.querySelector('input[name="nombre"]'), { target: { value: 'Test' } });
        fireEvent.change(container.querySelector('input[name="apellido"]'), { target: { value: 'User' } });
        
        fireEvent.change(container.querySelector('input[name="email"]'), { target: { value: 'correo-malo' } });
        
        fireEvent.submit(btn.closest('form'));
        
        await waitFor(() => {
            expect(screen.getByText(/inválido/i)).toBeInTheDocument();
        });
    });

    it('Debe llamar a la API de registro si todo es válido', async () => {
        const { container } = renderRegister();
        const btn = screen.getByRole('button', { name: /Registrarse/i });
        
        dataService.registerAPI.mockResolvedValue({ message: 'ok' });

        fireEvent.change(container.querySelector('input[name="nombre"]'), { target: { value: 'Juan' } });
        fireEvent.change(container.querySelector('input[name="apellido"]'), { target: { value: 'Perez' } });
        
        fireEvent.change(container.querySelector('input[name="rut"]'), { target: { value: '11.111.111-1' } }); 
        
        fireEvent.change(container.querySelector('input[name="telefono"]'), { target: { value: '912345678' } });
        fireEvent.change(container.querySelector('input[name="email"]'), { target: { value: 'juan@test.com' } });
        fireEvent.change(container.querySelector('input[name="password"]'), { target: { value: 'Pass123$' } });
        fireEvent.change(container.querySelector('input[name="confirmPassword"]'), { target: { value: 'Pass123$' } });
        
        const terminos = container.querySelector('input[name="terminos"]');
        if (!terminos.checked) fireEvent.click(terminos);

        fireEvent.submit(btn.closest('form'));

        await waitFor(() => {
            expect(dataService.registerAPI).toHaveBeenCalled();
        });
    });
});