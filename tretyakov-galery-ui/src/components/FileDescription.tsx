const FileDescription = ({ name, value }: { name: string; value: string }) => {
  return (
    <span className={'file_description'}>
      <span className={'description'}>{name} </span>
      {value}
    </span>
  )
}

export default FileDescription
