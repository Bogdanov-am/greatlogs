export const handleCancel = () => {
        if (
            window.confirm(
                'Вы уверены, что хотите отменить создание испытания? Все введенные данные будут потеряны.'
            )
        ) {
            localStorage.removeItem('experimentForm');
            window.location.href = '/';
        }
};
    
export const handleCancelWithDelete = async (
    experimentId: number | undefined,
    onDeleteExperiment: (id: string) => Promise<void>
) => {
    if (
        window.confirm(
            'Вы уверены, что хотите отменить создание испытания? Все введенные данные будут потеряны.'
        )
    ) {
        if (experimentId) {
            try {
                await onDeleteExperiment(experimentId.toString());
            } catch (error) {
                console.error('Ошибка при удалении эксперимента:', error);
            }
        }
        localStorage.removeItem('experimentForm');
        window.location.href = '/';
    }
};