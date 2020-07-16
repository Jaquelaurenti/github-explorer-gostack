import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link  } from 'react-router-dom'
import { FiChevronsLeft, FiChevronRight } from 'react-icons/fi'
import { Header, RepositoryInfo, Issues } from './style'
import logoImg from '../../assets/logo.svg';
import api from '../../services/api'

// Criando uma interface para tipar os parâmetros recebidos da rota
interface RepositoryParams {
  repository: string;
}

interface RepositoryInfos {
  full_name: string;
  description: string;
  stargazers_count: number;
  open_issues_count: number;
  forks_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string
  }
}

const Repository: React.FunctionComponent = () => {
  // buscando os parâmetros enviado para a rota
  const { params } = useRouteMatch<RepositoryParams>();

  const [repository, setRepository] = useState<RepositoryInfos | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    api.get(`repos/${params.repository}`).then(response => {
      setRepository(response.data);
    });
    api.get(`repos/${params.repository}/issues`).then(response => {
      setIssues(response.data);
    });

    /*async function loadData(): Promise<void> {
      const [repository, issues] = await Promise.all([
        api.get(`repos/${params.repository}`),
        api.get(`repos/${params.repository}/issues`)
      ]);
      console.log(repository);
      console.log(issues);
    }
    loadData();*/

  },[params.repository])


  return (
    <>
      <Header>
        <img src={logoImg} alt="GithubExplorer" />
        <Link to="/">
          <FiChevronsLeft size={20}/>
          Voltar
        </Link>
      </Header>

      {repository && (
        <RepositoryInfo>
          <header>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}/>
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Starts</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues Abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {issues.map(repo => (
          <a key={repo.id}href={repo.html_url}>
            <div>
              <strong>{repo.title}</strong>
              <p>{repo.user.login}</p>
            </div>
            <FiChevronRight />
          </a>
        ))}
      </Issues>
    </>
  );
}

export default Repository;
