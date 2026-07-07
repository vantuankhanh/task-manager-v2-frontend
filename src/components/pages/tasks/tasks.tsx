import { useEffect, useState } from "react";
import { useRole, useUser } from "@/libs/hooks/use-user";
import { setLoading } from "@/libs/store/reducer/reducer";
import { useAppDispatch } from "@/libs/store/store";
import { getEmployee, IEmployeeModel } from "@/services/employee";
import { getTask, ITaskModel } from "@/services/task";
import TableTask from "@/components/pages/tasks/table-task";

const Tasks = () => {
  const role = useRole();
  const user = useUser();
  const dispatch = useAppDispatch();

  const [taskLst, setTaskLst] = useState<ITaskModel[]>([]);
  const [empList, setEmpList] = useState<IEmployeeModel[]>([]);

  const getEmpLst = async () => {
    dispatch(setLoading(true));
    const data = await getEmployee();
    setEmpList(data ?? []);
    dispatch(setLoading(false));
  };

  const getTaskLst = async () => {
    dispatch(setLoading(true));
    const data = role === 0 ? await getTask(user!.id) : await getTask();
    setTaskLst(data ?? []);
    dispatch(setLoading(false));
  };

  const getEmpTask = async () => {
    dispatch(setLoading(true));
    await getEmpLst();
    await getTaskLst();
    dispatch(setLoading(false));
  };

  useEffect(() => {
    getEmpTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TableTask empList={empList} taskLst={taskLst} getTask={getTaskLst} />
    </>
  );
};

export default Tasks;
