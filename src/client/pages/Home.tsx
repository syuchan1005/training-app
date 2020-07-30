import React, { FC, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  TextField, Typography, Button, CardContent, Card, CircularProgress,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

import LoginMutationQuery from '@clientGql/login.gql';
import {
  LoginMutation,
  LoginMutationVariables,
} from '@common/GQLTypes';
import { useGlobalStore } from '@client/store/StoreProvider';

const useStyles = makeStyles((theme) => createStyles({
  center: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formMargin: {
    marginTop: theme.spacing(2),
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const Home: FC = (props) => {
  const classes = useStyles(props);
  const store = useGlobalStore();
  const client = useApolloClient();
  const history = useHistory();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const [doLogin, { loading }] = useMutation<LoginMutation, LoginMutationVariables>(
    LoginMutationQuery,
    {
      variables: { id, password },
      onCompleted(data) {
        store.dispatch({ loginToken: data.login });
        // @ts-ignore
        client.$token = data.login.token;
        history.push('/user_list');
      },
    },
  );

  const onLoginClick = useCallback(() => {
    if (id && password) doLogin();
  }, [id, password]);

  return (
    <main className={classes.center}>
      <Card>
        <CardContent>
          <Typography variant="h5">ユーザー管理システム</Typography>
          <form className={classes.form}>
            <TextField
              label="ID"
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={loading}
            />
            <TextField
              className={classes.formMargin}
              type="password"
              label="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              className={classes.formMargin}
              type="submit"
              variant="outlined"
              onClick={onLoginClick}
              disabled={loading}
            >
              ログイン
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default Home;
