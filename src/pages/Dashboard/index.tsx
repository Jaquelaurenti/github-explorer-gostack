import React, { useState, FormEvent, useEffect } from 'react';
import { Title, Form, Repositories, Error } from './style'
import { FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom';

import logoImg from '../../assets/logo.svg';
import api from '../../services/api'
import Repository from '../Repository';

// Coloco as informacoes que vou utilizar
interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FunctionComponent = () => {
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@githubExplorer:repositories');

    if(storagedRepositories) {
      // como eu converti ele para json quando salvei, quando eu busco
      // preciso fazer o contrário
      return JSON.parse(storagedRepositories);
    } else {
      return [];
    }

  });
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setNewError] = useState('');

  // UseEfect para sempre que alterar algo no repositorie, seja atualizado imediatamente
  useEffect(() => {
    localStorage.setItem(
      '@githubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  // Pegando o Evento do Formulário onde, o HTMLFormElement representa o elemento HTML do form
  // e o formEvent representa o evento de submit do form (ou outros eventos que estejam atrelados ao form)
  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    // Representa um prevenção de comportamento padrão do HTML
    event.preventDefault();
    if(!newRepo) {
      setNewError('Digite o autor/repositorio para a efetuar a busca');
      return;
    }
    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);
      const repository = response.data;
      setRepositories([...repositories, repository]);
      setNewRepo('');
    } catch(err) {
      setNewError('Erro ao realizar a busca!');
      return;
    }
  };

  return (
    <>
      <img src={logoImg} alt="Github Explorer"/>

      <Title>Dashboard</Title>

      <Form
        hasError={!!inputError}
        onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório" />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repo => (
          <Link key={repo.full_name}
            to={`repositories/${repo.full_name}`}>
            <img
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
            />
            <div>
              <strong>{repo.full_name}</strong>
              <p>
                {repo.description}
              </p>
            </div>
            <FiChevronRight />
          </Link>
        ))}
      </Repositories>
    </>

  );
}

export default Dashboard;

// Function Component = Componente escrito no formato de função


