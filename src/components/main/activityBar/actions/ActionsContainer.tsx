import ActionItem from "./ActionItem";

const ActionsContainer = (props: any) => {
    const content = props.buttons.map((post: any) => {
        return <ActionItem key={post.id} props={post} />;
    });

    return (
        <ul id="actions-container" className="actions-container">
            {content}
        </ul>
    );
};

export default ActionsContainer;
