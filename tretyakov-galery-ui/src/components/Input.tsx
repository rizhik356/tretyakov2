const Input = ({ name, url }: { name: string; url?: string }) => {
  return (
    <div className={'input_container'}>
      <span>{name}</span>
      <input readOnly={true} value={url} />
    </div>
  )
}

export default Input
