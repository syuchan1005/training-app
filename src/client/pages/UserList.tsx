import React, {
  FC, forwardRef, useCallback, useEffect, useRef, useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { useGlobalStore } from '@client/store/StoreProvider';
import {
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Select, FormControl, InputLabel, MenuItem,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useQuery, useMutation } from '@apollo/react-hooks';

import UsersQueryQuery from '@clientGql/users.gql';
import RolesQueryQuery from '@clientGql/roles.gql';
import RemoveUserQuery from '@clientGql/removeUser.gql';
import EditUserQuery from '@clientGql/editUser.gql';
import AddUserQuery from '@clientGql/addUser.gql';
import RevokeTokenQuery from '@clientGql/revokeToken.gql';
import {
  UsersQuery,
  UsersQueryVariables,
  RolesQuery,
  RolesQueryVariables,
  RemoveUserMutation,
  RemoveUserMutationVariables,
  EditUserMutation,
  EditUserMutationVariables,
  AddUserMutation,
  AddUserMutationVariables,
  RevokeTokenMutation,
  RevokeTokenMutationVariables,
} from '@common/GQLTypes';
import MaterialTable, { Icons, MTableToolbar, Options } from 'material-table';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons: Icons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const options: Options<any> = {
  padding: 'dense',
  paging: false,
};

const useStyles = makeStyles((theme) => createStyles({
  title: {
    display: 'flex',
    margin: theme.spacing(1),
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    '& .MuiToolbar-root': {
      flex: 1,
    },
  },
  addForm: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
}));

const addFormInitState = {
  loginId: '',
  userName: '',
  telephone: '',
  roleId: 2,
  password: '',
  rePassword: '',
};

const UserList: FC = (props) => {
  const classes = useStyles(props);
  const store = useGlobalStore();
  const history = useHistory();

  const [addState, setAddState] = useState<typeof addFormInitState | undefined>(
    undefined,
  );
  const addDialogFormRef = useRef<HTMLFormElement>();

  useEffect(() => {
    if (!store.state.loginToken) {
      history.push('/');
    }
  }, []);

  const {
    data,
    refetch,
    loading,
  } = useQuery<UsersQuery, UsersQueryVariables>(UsersQueryQuery);
  const {
    data: rolesData,
  } = useQuery<RolesQuery, RolesQueryVariables>(RolesQueryQuery);

  const [doRemoveUser] = useMutation<RemoveUserMutation, RemoveUserMutationVariables>(
    RemoveUserQuery,
    {
      onCompleted(d) {
        if (d.removeUser) refetch();
      },
    },
  );
  const [doEditUser] = useMutation<EditUserMutation, EditUserMutationVariables>(
    EditUserQuery,
    {
      onCompleted(d) {
        if (d.editUser) refetch();
      },
    },
  );
  const [
    doAddUser,
    { loading: addLoading },
  ] = useMutation<AddUserMutation, AddUserMutationVariables>(
    AddUserQuery,
    {
      onCompleted(d) {
        if (d.addUser) {
          setAddState(undefined);
          refetch();
        }
      },
    },
  );
  const [doRevokeToken] = useMutation<RevokeTokenMutation, RevokeTokenMutationVariables>(
    RevokeTokenQuery,
  );

  const onAddDialogAddClick = useCallback(() => {
    if (addDialogFormRef.current?.checkValidity() && addState.password === addState.rePassword) {
      const user = { ...addState };
      delete user.rePassword;
      doAddUser({ variables: { user } });
    }
  }, [addDialogFormRef, addState, doAddUser]);

  const onLoginClick = useCallback(() => {
    doRevokeToken();
    store.dispatch({ loginToken: undefined });
    history.push('/');
  }, []);

  return (
    <main>
      {(store.state.loginToken) && (
        <>
          <Typography variant="h6" className={classes.title}>
            {store.state.loginToken.name}
            さん、こんにちは
            <div style={{ flex: 1 }} />
            <Button variant="outlined" onClick={onLoginClick}>ログアウト</Button>
          </Typography>
          <div style={{ maxWidth: '100%' }}>
            <MaterialTable
              title="ユーザー一覧"
              icons={tableIcons}
              options={options}
              isLoading={loading || addLoading}
              components={{
                Toolbar: (p) => (
                  <div className={classes.toolbar}>
                    <MTableToolbar {...p} />
                    <IconButton onClick={() => refetch()}>
                      <RefreshIcon />
                    </IconButton>
                    {store.state.loginToken.role.isAdmin && (
                      <IconButton onClick={() => setAddState(addFormInitState)}>
                        <AddBox />
                      </IconButton>
                    )}
                  </div>
                ),
              }}
              localization={{
                body: {
                  addTooltip: '追加',
                  editTooltip: '編集',
                  deleteTooltip: '削除',
                  editRow: {
                    saveTooltip: 'OK',
                    cancelTooltip: 'キャンセル',
                    deleteText: '削除してよろしいですか？',
                  },
                },
              }}
              columns={[
                { title: 'ID', field: 'loginId' },
                { title: '名前', field: 'userName' },
                { title: 'TEL', field: 'telephone' },
                {
                  title: '権限',
                  field: 'role.roleId',
                  lookup: (rolesData?.roles || []).reduce((obj, next) => ({
                    ...obj,
                    [next.roleId]: next.roleName,
                  }), {}),
                },
              ]}
              data={(data?.users || [])}
              editable={!(store.state.loginToken.role.isAdmin) ? undefined : {
                onRowUpdate: (newData, oldData) => doEditUser({
                  variables: {
                    userId: oldData.userId,
                    user: {
                      loginId: newData.loginId,
                      userName: newData.userName,
                      telephone: newData.telephone,
                      roleId: newData.role.roleId,
                    },
                  },
                }),
                onRowDelete: (oldData) => doRemoveUser({
                  variables: {
                    userIds: [oldData.userId],
                  },
                }),
              }}
            />
          </div>
        </>
      )}

      <Dialog open={!!addState}>
        <DialogTitle>ユーザ追加</DialogTitle>
        <DialogContent>
          <DialogContentText>
            登録情報を入力してください。
            *は必須です。
          </DialogContentText>
          <form noValidate autoComplete="off" className={classes.addForm} ref={addDialogFormRef}>
            <TextField
              label="ID"
              required
              fullWidth
              value={(addState || addFormInitState).loginId}
              onChange={(e) => setAddState({
                ...addFormInitState,
                ...addState,
                loginId: e.target.value,
              })}
            />
            <TextField
              label="名前"
              required
              fullWidth
              value={(addState || addFormInitState).userName}
              onChange={(e) => setAddState({
                ...addFormInitState,
                ...addState,
                userName: e.target.value,
              })}
            />
            <TextField
              label="TEL"
              required
              fullWidth
              value={(addState || addFormInitState).telephone}
              onChange={(e) => setAddState({
                ...addFormInitState,
                ...addState,
                telephone: e.target.value,
              })}
            />
            <FormControl fullWidth>
              <InputLabel>権限</InputLabel>
              <Select
                value={(addState || addFormInitState).roleId}
                onChange={(e) => setAddState({
                  ...addFormInitState,
                  ...addState,
                  roleId: Number(e.target.value),
                })}
              >
                {(rolesData?.roles || []).map((role) => (
                  <MenuItem key={role.roleId} value={role.roleId}>{role.roleName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Pass"
              type="password"
              required
              fullWidth
              value={(addState || addFormInitState).password}
              onChange={(e) => setAddState({
                ...addFormInitState,
                ...addState,
                password: e.target.value,
              })}
            />
            <TextField
              label="Pass (再入力)"
              type="password"
              required
              fullWidth
              value={(addState || addFormInitState).rePassword}
              onChange={(e) => setAddState({
                ...addFormInitState,
                ...addState,
                rePassword: e.target.value,
              })}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onAddDialogAddClick}>
            追加
          </Button>
          <Button onClick={() => setAddState(undefined)}>
            キャンセル
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default UserList;
